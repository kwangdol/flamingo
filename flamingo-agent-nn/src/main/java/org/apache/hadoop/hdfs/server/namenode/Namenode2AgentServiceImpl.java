/*
 * Copyright (C) 2012-2016 the Flamingo Community.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.apache.hadoop.hdfs.server.namenode;

import org.apache.commons.codec.binary.Base64;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.*;
import org.apache.hadoop.hdfs.DistributedFileSystem;
import org.apache.hadoop.hdfs.protocol.DatanodeInfo;
import org.apache.hadoop.hdfs.protocol.FSConstants;
import org.apache.hadoop.hdfs.protocol.HdfsConstants;
import org.apache.hadoop.hdfs.protocol.HdfsFileStatus;
import org.apache.hadoop.hdfs.server.blockmanagement.DatanodeDescriptor;
import org.apache.hadoop.hdfs.server.blockmanagement.DatanodeManager;
import org.apache.hadoop.hdfs.util.ReadOnlyList;
import org.apache.hadoop.util.Time;
import org.exem.flamingo.agent.nn.Namenode2AgentService;
import org.exem.flamingo.agent.nn.hdfs.HdfsFileInfo;
import org.exem.flamingo.shared.model.rest.FileInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.*;

import static org.apache.hadoop.hdfs.server.namenode.Namenode2Agent.MEGA_BYTES;

/**
 * HDFS 브라우저의 HDFS 관리 동작에 필요한 기능을 제공하는 서비스.
 *
 * @author Byoung Gon, Kim
 * @since 0.1
 */
public class Namenode2AgentServiceImpl extends FileSystemProvider implements Namenode2AgentService {

    /**
     * SLF4J Logging
     */
    private Logger logger = LoggerFactory.getLogger(Namenode2AgentServiceImpl.class);

    public List<Map> getTop5() throws IOException {
        FileSystem fs = FileSystem.get(Namenode2Agent.configuration);
        FileStatus[] fileStatuses = fs.listStatus(new Path("/"));
        TreeSet set = new TreeSet();

        for (FileStatus fileStatus : fileStatuses) {
            ContentSummary contentSummary = fs.getContentSummary(fileStatus.getPath());
            FileMetadata fileMetadata = new FileMetadata(fileStatus, contentSummary);
            if (fileMetadata.getFileStatus().isDirectory()) {
                set.add(fileMetadata);
            }
        }

        List top5 = new LinkedList();
        Object[] arrays = set.toArray();
        int totalCount = 0;

        for (Object array : arrays) {
            top5.add(toMap(fs, (FileMetadata) array));
            totalCount++;

            if (totalCount == 5)
                break;
        }

        return top5;
    }

    @Override
    public Map getListPage(String path, int page, int start, int limit, String filter) throws IOException {
        NameNode namenode = Namenode2Agent.namenode;
        FSNamesystem fsNamesystem = namenode.getNamesystem();
        FileSystem fs = FileSystem.get(Namenode2Agent.configuration);
        FSDirectory fsDirectory = fsNamesystem.getFSDirectory();
        List<FileInfo> fileInfoList = new ArrayList<>();
        List<FileInfo> dirInfoList = new ArrayList<>();
        List<FileInfo> totalInfoList = new ArrayList<>();
        Map returnMap = new HashMap();

        final INodesInPath inodesInPath = fsDirectory.getINodesInPath(path, true);
        final int snapshot = inodesInPath.getPathSnapshotId();
        final INode targetNode = inodesInPath.getLastINode();
        final INodeDirectory dirInode = targetNode.asDirectory();
        final ReadOnlyList<INode> contents = dirInode.getChildrenList(snapshot);
        int startChild = INodeDirectory.nextChild(contents, HdfsFileStatus.EMPTY_NAME);
        int totalNumChildren = contents.size();

        long totalFileCount = 0;
        long totalDirCount = 0;
        long totalCount = 0;
        long startDir = 0;
        long startFile = 0;
        int limitFileCount = 0;
        int limitDirCount = 0;
        int curFileCount = 0;
        int curDirCount = 0;
        int addedFileCount = 0;
        int addedDirCount = 0;
        long limitCur = 0;
        INode cur = null;
        boolean isFilter = filter == null ? false : true;

        for (int i = 0; i < totalNumChildren; i++) {
            cur = contents.get(startChild + i);

            if (cur.isFile()) {
                ++totalFileCount;
            }

            if (cur.isDirectory()) {
                ++totalDirCount;
            }
        }

        totalCount = totalFileCount + totalDirCount;

        if (totalCount <= limit) {
            limitFileCount = (int) totalFileCount;
            limitDirCount = (int) totalDirCount;
        } else {
            if (totalDirCount > start && totalDirCount - start < limit) {
                startDir = start;
                limitDirCount = (int) (totalDirCount - start);
                limitFileCount = limit - limitDirCount;
                startFile = 0;
            } else if (totalDirCount > start && totalDirCount - start >= limit) {
                startDir = start;
                limitDirCount = limit;
                limitFileCount = 0;
            } else if (totalDirCount <= start) {
                startFile = start - totalDirCount;
                limitDirCount = 0;
                limitFileCount = limit;
            }
        }

        String filterArr[];
        String name;

        for (int i = 0; i < totalNumChildren; i++) {
            cur = contents.get(startChild + i);

            if (cur.isDirectory() && addedDirCount < limitDirCount) {

                if (curDirCount >= startDir) {

                    if (isFilter) {
                        filterArr = cur.getFullPathName().split("/");

                        name = filterArr[filterArr.length - 1];

                        if (name.indexOf(filter) == -1) {
                            continue;
                        }
                    }

                    FileStatus file = fs.getFileStatus(new Path(cur.getFullPathName()));
                    dirInfoList.add(new HdfsFileInfo(file, fs.getContentSummary(file.getPath())));
                    ++addedDirCount;
                }

                ++curDirCount;
            }

            if (cur.isFile() && addedFileCount < limitFileCount) {

                if (curFileCount >= startFile) {

                    if (isFilter) {
                        filterArr = cur.getFullPathName().split("/");

                        name = filterArr[filterArr.length - 1];

                        if (name.indexOf(filter) == -1) {
                            continue;
                        }
                    }

                    FileStatus file = fs.getFileStatus(new Path(cur.getFullPathName()));
                    fileInfoList.add(new HdfsFileInfo(file, fs.getContentSummary(file.getPath())));
                    ++addedFileCount;
                }

                ++curFileCount;
            }
        }

        try {
            FileStatus parentStatus = fs.getFileStatus(new Path(dirInode.getParent().getFullPathName()));
            HdfsFileInfo parentFileInfo = new HdfsFileInfo(parentStatus, fs.getContentSummary(parentStatus.getPath()));

            returnMap.put("parentFileInfo", parentFileInfo);
        } catch (Exception ex) {

        }

        totalInfoList.addAll(dirInfoList);
        totalInfoList.addAll(fileInfoList);

        returnMap.put("total", totalCount);
        returnMap.put("cursor", limitCur);
        returnMap.put("fileInfoList", totalInfoList);

        return returnMap;
    }

    @Override
    public Map getTopN(String path, int limit, boolean sort) throws IOException {
        NameNode namenode = Namenode2Agent.namenode;
        FSNamesystem fsNamesystem = namenode.getNamesystem();
        FileSystem fs = FileSystem.get(Namenode2Agent.configuration);
        FSDirectory fsDirectory = fsNamesystem.getFSDirectory();
        List<FileInfo> dirInfoList = new ArrayList<>();

        final INodesInPath inodesInPath = fsDirectory.getINodesInPath(path, true);
        final int snapshot = inodesInPath.getPathSnapshotId();
        final INode targetNode = inodesInPath.getLastINode();
        final INodeDirectory dirInode = targetNode.asDirectory();
        final ReadOnlyList<INode> contents = dirInode.getChildrenList(snapshot);
        int startChild = INodeDirectory.nextChild(contents, HdfsFileStatus.EMPTY_NAME);
        int totalNumChildren = contents.size();
        int i, j, idx, inserted = 1;
        long min = 0, max = 0, length;
        boolean sorted = false;
        List<Long> lengthList = new ArrayList<>();

        INode cur = null;
        ContentSummary contentSummary;
        FileStatus file;

        for (i = 0; i < totalNumChildren; i++) {
            cur = contents.get(startChild + i);

            if (cur.isDirectory() && inserted <= limit) {
                file = fs.getFileStatus(new Path(cur.getFullPathName()));
                contentSummary = fs.getContentSummary(file.getPath());
                dirInfoList.add(new HdfsFileInfo(file, contentSummary));

                length = contentSummary.getLength();
                if (inserted == 1) {
                    max = length;
                    min = length;
                } else {
                    if (length > max) {
                        max = length;
                    }

                    if (length < min) {
                        min = length;
                    }
                }

                lengthList.add(length);

                ++inserted;
            } else if (cur.isDirectory() && inserted > limit) {
                if (!sorted) {
                    Collections.sort(dirInfoList, FileInfo.LengthComparator);
                    Collections.reverse(lengthList);
                    sorted = true;
                }

                contentSummary = fs.getContentSummary(new Path(cur.getFullPathName()));
                length = contentSummary.getLength();

                if (length > min) {

                    lengthList.remove(limit - 1);
                    dirInfoList.remove(limit - 1);

                    file = fs.getFileStatus(new Path(cur.getFullPathName()));

                    dirInfoList.add(0, new HdfsFileInfo(file, contentSummary));
                    lengthList.add(0, length);

                    if (length > max) {
                        max = length;
                    }
                }
            }
        }

        Collections.sort(dirInfoList, FileInfo.LengthComparator);

        Map resultMap = new HashMap();

        resultMap.put("dirList", dirInfoList);
        resultMap.put("max", max);
        resultMap.put("min", min);

        return resultMap;
    }

    @Override
    public ContentSummary getContentSummary(String path) throws IOException {
        FileSystem fs = FileSystem.get(Namenode2Agent.configuration);

        return fs.getContentSummary(new Path(path));
    }

    private Map toMap(FileSystem fs, FileMetadata file) throws IOException {
        Map map = new HashMap();
        FileStatus fileStatus = file.getFileStatus();
        ContentSummary contentSummary = file.getContentSummary();

        FsStatus status = fs.getStatus();
        map.put("capacity", status.getCapacity());
        map.put("remaining", status.getRemaining());
        map.put("used", status.getUsed());

        map.put("spaceConsumed", contentSummary.getSpaceConsumed()); // 실제 파일의 크기 * Replication
        map.put("directoryCount", contentSummary.getDirectoryCount());
        map.put("fileCount", contentSummary.getFileCount());
        map.put("length", contentSummary.getLength()); // 실제 파일의 크기
        map.put("quota", contentSummary.getQuota());
        map.put("spaceQuota", contentSummary.getSpaceQuota());
        map.put("path", fileStatus.getPath().toUri().getPath());
        map.put("replication", fileStatus.getReplication());
        map.put("blockSize", fileStatus.getBlockSize());

        return map;
    }

    static class FileMetadata implements Comparable<FileMetadata> {
        private FileStatus fileStatus;
        private ContentSummary contentSummary;

        public FileMetadata(FileStatus fileStatus, ContentSummary contentSummary) {
            this.fileStatus = fileStatus;
            this.contentSummary = contentSummary;
        }

        public FileStatus getFileStatus() {
            return fileStatus;
        }

        public void setFileStatus(FileStatus fileStatus) {
            this.fileStatus = fileStatus;
        }

        public ContentSummary getContentSummary() {
            return contentSummary;
        }

        public void setContentSummary(ContentSummary contentSummary) {
            this.contentSummary = contentSummary;
        }

        @Override
        public int compareTo(FileMetadata f) {
            if (this.contentSummary.getSpaceConsumed() > f.getContentSummary().getSpaceConsumed()) {
                return -1;
            } else if (this.contentSummary.getSpaceConsumed() < f.getContentSummary().getSpaceConsumed()) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    public void saveNamespace() throws IOException {
        NameNode namenode = Namenode2Agent.namenode;
        FileSystem fs = FileSystem.get(namenode.conf);
        if (fs instanceof DistributedFileSystem) {
            DistributedFileSystem dfs = (DistributedFileSystem) fs;
            dfs.saveNamespace();
        } else {
            throw new UnsupportedOperationException("지원하지 않는 기능입니다.");
        }
    }

    @Override
    public Map getNamenodeInfo() {
        Map map = new HashMap<>();
        NameNode namenode = Namenode2Agent.namenode;
        Configuration configuration = Namenode2Agent.configuration;

        map.put("hostName", namenode.getAddress(configuration).getHostName());
        map.put("port", namenode.getAddress(configuration).getPort());

        // Block
        map.put("blocksTotal", namenode.getNamesystem().getBlocksTotal());
        map.put("corruptReplicatedBlocks", namenode.getNamesystem().getCorruptReplicaBlocks());
        map.put("pendingReplicationBlocks", namenode.getNamesystem().getPendingReplicationBlocks());
        map.put("scheduledReplicationBlocks", namenode.getNamesystem().getScheduledReplicationBlocks());
        map.put("underReplicatedBlocks", namenode.getNamesystem().getUnderReplicatedBlocks());
        map.put("missingBlocks", namenode.getNamesystem().getNumberOfMissingBlocks());
        map.put("blockCapacity", namenode.getNamesystem().getBlockCapacity());

        // Node Status
        map.put("all", namenode.getNamesystem().getNumberOfDatanodes(HdfsConstants.DatanodeReportType.ALL));
        map.put("dead", namenode.getNamesystem().getNumberOfDatanodes(HdfsConstants.DatanodeReportType.DEAD));
        map.put("live", namenode.getNamesystem().getNumberOfDatanodes(HdfsConstants.DatanodeReportType.LIVE));
        map.put("decommissioning", namenode.getNamesystem().getNumberOfDatanodes(HdfsConstants.DatanodeReportType.DECOMMISSIONING));
        map.put("stale", namenode.getNamesystem().getNumStaleDataNodes());

        // FSNamesystem
        //map.put("defaultBlockSize", namenode.getNamesystem().getDefaultBlockSize());
        map.put("defaultBlockSize", configuration.get("dfs.blocksize"));
        map.put("totalFiles", namenode.getNamesystem().getTotalFiles());
        map.put("totalBlocks", namenode.getNamesystem().getTotalBlocks());
        map.put("totalLoad", namenode.getNamesystem().getTotalLoad());

        // DFS Capacity
        map.put("capacityRemaining", namenode.getNamesystem().getCapacityRemainingGB());
        map.put("capacityRemainingPercent", Math.round(100 / namenode.getNamesystem().getCapacityTotal() * namenode.getNamesystem().getCapacityRemaining()));
        map.put("capacityTotal", namenode.getNamesystem().getCapacityTotalGB());
        map.put("capacityUsed", namenode.getNamesystem().getCapacityUsedGB());
        map.put("capacityUsedNonDFS", namenode.getNamesystem().getCapacityUsedNonDFS());
        map.put("capacityUsedPercent", Math.round(100 / namenode.getNamesystem().getCapacityTotal() * namenode.getNamesystem().getCapacityUsedNonDFS()));

        // DFS Usage
        map.put("free", namenode.getNamesystem().getFree());
        map.put("used", namenode.getNamesystem().getUsed());
        map.put("total", namenode.getNamesystem().getTotal());
        map.put("threads", namenode.getNamesystem().getThreads());
        map.put("startTime", namenode.getNamesystem().getStartTime());

        // JVM Heap Size
        final Runtime rt = Runtime.getRuntime();
        final long totalMemory = rt.totalMemory() / MEGA_BYTES;
        final long freeMemory = rt.freeMemory() / MEGA_BYTES;
        map.put("jvmMaxMemory", rt.maxMemory() / MEGA_BYTES);
        map.put("jvmTotalMemory", rt.totalMemory() / MEGA_BYTES);
        map.put("jvmFreeMemory", rt.freeMemory() / MEGA_BYTES);
        map.put("jvmUsedMemory", totalMemory - freeMemory);
        return map;
    }

    @Override
    public Map getConfiguration() {
        Configuration configuration = Namenode2Agent.configuration;
        Map map = new HashMap<>();
        Iterator<Map.Entry<String, String>> i = configuration.iterator();
        while (i.hasNext()) {
            Map.Entry<String, String> next = i.next();
            map.put(next.getKey(), next.getValue());
        }
        return map;
    }

    @Override
    public Map getMetrics() {
        NameNode namenode = Namenode2Agent.namenode;
        Map map = new HashMap<>();
        map.put("all", namenode.getNamesystem().getNumberOfDatanodes(HdfsConstants.DatanodeReportType.ALL));
        map.put("dead", namenode.getNamesystem().getNumberOfDatanodes(HdfsConstants.DatanodeReportType.DEAD));
        map.put("live", namenode.getNamesystem().getNumberOfDatanodes(HdfsConstants.DatanodeReportType.LIVE));
        map.put("decommisioning", namenode.getNamesystem().getNumberOfDatanodes(HdfsConstants.DatanodeReportType.DECOMMISSIONING));

        map.put("blocksTotal", namenode.getNamesystem().getBlocksTotal());
        map.put("corrupt", namenode.getNamesystem().getCorruptReplicaBlocks());
        map.put("underReplicatedBlocks", namenode.getNamesystem().getUnderReplicatedBlocks());

        map.put("totalFiles", namenode.getNamesystem().getTotalFiles());
        map.put("totalBlocks", namenode.getNamesystem().getTotalBlocks());
        map.put("totalLoad", namenode.getNamesystem().getTotalLoad());

        map.put("capacityRemaining", namenode.getNamesystem().getCapacityRemaining());
        map.put("capacityRemainingPercent", namenode.getNamesystem().getPercentRemaining());
        map.put("capacityTotal", namenode.getNamesystem().getCapacityTotal());
        map.put("capacityUsed", namenode.getNamesystem().getCapacityUsed());
        map.put("capacityUsedNonDFS", namenode.getNamesystem().getCapacityUsedNonDFS());
        map.put("capacityUsedPercent", namenode.getNamesystem().getPercentUsed());

        map.put("editLogSize", namenode.getNamesystem().getEditLog()); //FIXME to getEditLogSize()

        map.put("free", namenode.getNamesystem().getFree());
        map.put("used", namenode.getNamesystem().getUsed());
        map.put("total", namenode.getNamesystem().getTotal());

        map.put("threads", namenode.getNamesystem().getThreads());
        return map;
    }

    @Override
    public List getDatanodes() throws IOException {
        List result = new ArrayList();
        NameNode namenode = Namenode2Agent.namenode;

        DatanodeInfo[] datanodes = namenode.getRpcServer().getDatanodeReport(FSConstants.DatanodeReportType.ALL);
        for (DatanodeInfo datanode : datanodes) {
            Map map = new HashMap<>();
            map.put("name", datanode.getName());
            map.put("capacity", datanode.getCapacity());
            map.put("dfsUsed", datanode.getDfsUsed());
            map.put("dfsUsedPercent", (int) datanode.getDfsUsedPercent());
            map.put("nonDfsUsed", datanode.getNonDfsUsed());
            map.put("remaining", datanode.getRemaining());
            map.put("remainingPercent", (int) datanode.getRemainingPercent());
            map.put("hostName", datanode.getHostName());
            map.put("lastUpdate", datanode.getLastUpdate());
            map.put("level", datanode.getLevel());
            map.put("networkLocation", datanode.getNetworkLocation());
            map.put("xceiverCount", datanode.getXceiverCount());
            map.put("infoPort", datanode.getInfoPort());
            map.put("ipcPort", datanode.getIpcPort());
            map.put("report", datanode.getDatanodeReport());
            map.put("state", datanode.getAdminState().name());
            map.put("isDecommissioned", datanode.isDecommissioned());
            map.put("isDecommissionInProgress", datanode.isDecommissionInProgress());
            map.put("dump", Base64.encodeBase64(datanode.dumpDatanode().getBytes()));
            result.add(map);
        }
        return result;
    }

    @Override
    public List<Map<String, Object>> getLiveNodes() {
        List result = new ArrayList();
        NameNode namenode = Namenode2Agent.namenode;

        DatanodeManager dm = namenode.getNamesystem().getBlockManager().getDatanodeManager();
        List<DatanodeDescriptor> live = new ArrayList<DatanodeDescriptor>();
        List<DatanodeDescriptor> dead = new ArrayList<DatanodeDescriptor>();

        dm.fetchDatanodes(live, dead, true);

        for (DatanodeDescriptor dd : live) {
            Map<String, Object> resultMap = new HashMap<>();

            resultMap.put("hostname", dd.getHostName());
            resultMap.put("ipAddr", dd.getIpAddr());
            resultMap.put("adminState", dd.getAdminState().toString());
            resultMap.put("capacity", dd.getCapacity());
            resultMap.put("dfsUsed", dd.getDfsUsed());
            resultMap.put("dfsUsedPercent", dd.getDfsUsedPercent());
            resultMap.put("nonDfsUsed", dd.getNonDfsUsed());
            resultMap.put("remaining", dd.getRemaining());
            resultMap.put("remainingPercent", dd.getRemainingPercent());
            resultMap.put("blocks", dd.numBlocks());
            resultMap.put("blockPoolUsed", dd.getBlockPoolUsed());
            resultMap.put("blockPoolUsedPercent", dd.getBlockPoolUsedPercent());
            resultMap.put("volumeFailures", dd.getVolumeFailures());
            resultMap.put("lastUpdate", dd.getLastUpdate());
            resultMap.put("networkLocation", dd.getNetworkLocation());

            long timestamp = dd.getLastUpdate();
            long currentTime = Time.now();
            long lastContact = (currentTime - timestamp) / 1000;

            resultMap.put("lastContact", lastContact);

            result.add(resultMap);
        }

        return result;
    }

    @Override
    public List<Map<String, Object>> getDeadNodes() {
        List result = new ArrayList();
        NameNode namenode = Namenode2Agent.namenode;

        DatanodeManager dm = namenode.getNamesystem().getBlockManager().getDatanodeManager();
        List<DatanodeDescriptor> dead = dm.getDatanodeListForReport(HdfsConstants.DatanodeReportType.DEAD);

        for (DatanodeDescriptor dd : dead) {
            Map<String, Object> resultMap = new HashMap<>();

            resultMap.put("hostname", dd.getHostName());
            resultMap.put("ipAddr", dd.getIpAddr());
            resultMap.put("decommissioned", dd.isDecommissioned());

            result.add(resultMap);
        }

        return result;
    }

    @Override
    public List<Map<String, Object>> getDecommissioningNodes() {
        List result = new ArrayList();
        NameNode namenode = Namenode2Agent.namenode;
        DatanodeManager dm = namenode.getNamesystem().getBlockManager().getDatanodeManager();
        List<DatanodeDescriptor> decommissioning = dm.getDecommissioningNodes();

        for (DatanodeDescriptor dd : decommissioning) {
            long decommRequestTime = dd.decommissioningStatus.getStartTime();
            long timestamp = dd.getLastUpdate();
            long currentTime = Time.now();
            long hoursSinceDecommStarted = (currentTime - decommRequestTime) / 3600000;
            long remainderMinutes = ((currentTime - decommRequestTime) / 60000) % 60;
            long lastContact = (currentTime - timestamp) / 1000;

            Map<String, Object> resultMap = new HashMap<>();

            resultMap.put("hostname", dd.getHostName());
            resultMap.put("lastContact", lastContact);
            resultMap.put("blockswithonlydecommissioningreplicas", dd.decommissioningStatus.getDecommissionOnlyReplicas());
            resultMap.put("underrepblocksinfilesunderconstruction", dd.decommissioningStatus.getUnderReplicatedInOpenFiles());
            resultMap.put("underreplicatedblocks", dd.decommissioningStatus.getUnderReplicatedBlocks());
            resultMap.put("startHour", hoursSinceDecommStarted);
            resultMap.put("startMinute", remainderMinutes);

            result.add(resultMap);
        }

        return result;
    }

    @Override
    public Map<String, Long> getJVMHeap() {
        final Runtime rt = Runtime.getRuntime();
        final long maxMemory = rt.maxMemory() / MEGA_BYTES;
        final long totalMemory = rt.totalMemory() / MEGA_BYTES;
        final long freeMemory = rt.freeMemory() / MEGA_BYTES;
        final long usedMemory = totalMemory - freeMemory;

        Map<String, Long> result = new HashMap<>();
        result.put("Max Memory", maxMemory);
        result.put("Total Memory", totalMemory);
        result.put("Free Memory", freeMemory);
        result.put("Used Memory", usedMemory);
        return result;
    }
}
