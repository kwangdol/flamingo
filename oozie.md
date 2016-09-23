# Oozie study
##Workflow
###Overview
Multistage Hadoop job with collection of action and control nodes arranged in a directed acyclic graph (DAG)

- workflow.xml

  >Namenode

  >Jobtracker
- job.properties
```
nameNode=hdfs://localhost:8020
jobTracker=localhost:8032
exampleDir=${nameNode}/user/${user.name}/ch01-identity
oozie.wf.application.path=${exampleDir}/app
```
- script(optional)

###Control node
- **start and end**
**syntax**
```xml
<workflow-app name="[WF-DEF-NAME]" xmlns="uri:oozie:workflow:0.1">
  ...
  <start to="[NODE-NAME]"/>
  ...
</workflow-app>
```
```xml
<workflow-app name="[WF-DEF-NAME]" xmlns="uri:oozie:workflow:0.1">
    ...
    <end name="[NODE-NAME]"/>
    ...
</workflow-app>
```

- **fork and join**
**syntax**
```xml
<workflow-app name="[WF-DEF-NAME]" xmlns="uri:oozie:workflow:0.1">
    ...
    <fork name="[FORK-NODE-NAME]">
        <path start="[NODE-NAME]" />
        ...
        <path start="[NODE-NAME]" />
    </fork>
    ...
    <join name="[JOIN-NODE-NAME]" to="[NODE-NAME]" />
    ...
</workflow-app>
```

**Example**
```xml
<workflow-app name="sample-wf" xmlns="uri:oozie:workflow:0.1">
    ...
    <fork name="forking">
        <path start="firstparalleljob"/>
        <path start="secondparalleljob"/>
    </fork>
    <action name="firstparallejob">
        <map-reduce>
            <job-tracker>foo:8021</job-tracker>
            <name-node>bar:8020</name-node>
            <job-xml>job1.xml</job-xml>
        </map-reduce>
        <ok to="joining"/>
        <error to="kill"/>
    </action>
    <action name="secondparalleljob">
        <map-reduce>
            <job-tracker>foo:8021</job-tracker>
            <name-node>bar:8020</name-node>
            <job-xml>job2.xml</job-xml>
        </map-reduce>
        <ok to="joining"/>
        <error to="kill"/>
    </action>
    <join name="joining" to="nextaction"/>
    ...
</workflow-app>
```
- **decision**
**syntax**
```xml
<workflow-app name="[WF-DEF-NAME]" xmlns="uri:oozie:workflow:0.1">
    ...
    <decision name="[NODE-NAME]">
        <switch>
            <case to="[NODE_NAME]">[PREDICATE]</case>
            ...
            <case to="[NODE_NAME]">[PREDICATE]</case>
            <default to="[NODE_NAME]"/>
        </switch>
    </decision>
    ...
</workflow-app>
```

**Example**
```xml
<workflow-app name="foo-wf" xmlns="uri:oozie:workflow:0.1">
    ...
    <decision name="mydecision">
        <switch>
            <case to="reconsolidatejob">
              ${fs:fileSize(secondjobOutputDir) gt 10 * GB}
            </case> <case to="rexpandjob">
              ${fs:fileSize(secondjobOutputDir) lt 100 * MB}
            </case>
            <case to="recomputejob">
              ${ hadoop:counters('secondjob')[RECORDS][REDUCE_OUT] lt 1000000 }
            </case>
            <default to="end"/>
        </switch>
    </decision>
    ...
</workflow-app>
```

- **kill**
**syntax**
```xml
<workflow-app name="[WF-DEF-NAME]" xmlns="uri:oozie:workflow:0.1">
    ...
    <kill name="[NODE-NAME]">
        <message>[MESSAGE-TO-LOG]</message>
    </kill>
    ...
</workflow-app>
```

**Example**
```xml
<workflow-app xmlns="uri:oozie:workflow:0.4" name="killNodeWF">
<start to="mapReduce"/>
<action name="mapReduce">
...
<ok to="done"/>
<error to="error"/>
</action>
<kill name="error">
<message>The 'mapReduce' action failed!</message>
<end name="done"/>
</workflow-app>
```

## Workflow Actions
###MapReduce
**syntax**

```xml
<workflow-app name="[WF-DEF-NAME]" xmlns="uri:oozie:workflow:0.5">
    ...
    <action name="[NODE-NAME]">
        <map-reduce>
            <job-tracker>[JOB-TRACKER]</job-tracker>
            <name-node>[NAME-NODE]</name-node>
            
            <prepare>
                <delete path="[PATH]"/>
                ...
                <mkdir path="[PATH]"/>
                ...
            </prepare>
            
            <streaming>
                <mapper>[MAPPER-PROCESS]</mapper>
                <reducer>[REDUCER-PROCESS]</reducer>
                <record-reader>[RECORD-READER-CLASS]</record-reader>
                <record-reader-mapping>[NAME=VALUE]</record-reader-mapping>
                ...
                <env>[NAME=VALUE]</env>
                ...
            </streaming>
			<!-- Either streaming or pipes can be specified for an action, not both -->
            <pipes>
                <map>[MAPPER]</map>
                <reduce>[REDUCER]</reducer>
                <inputformat>[INPUTFORMAT]</inputformat>
                <partitioner>[PARTITIONER]</partitioner>
                <writer>[OUTPUTFORMAT]</writer>
                <program>[EXECUTABLE]</program>
            </pipes>
            <job-xml>[JOB-XML-FILE]</job-xml>
            
            
            <configuration>
                <property>
                    <name>[PROPERTY-NAME]</name>
                    <value>[PROPERTY-VALUE]</value>
                </property>
                ...
            </configuration>
            <config-class>com.example.MyConfigClass</config-class>
            <file>[FILE-PATH]</file>
            ...
            <archive>[FILE-PATH]</archive>
            ...
        </map-reduce>        <ok to="[NODE-NAME]"/>
        <error to="[NODE-NAME]"/>
    </action>
    ...
</workflow-app>
```

**Example**
```xml
<action name="identity-MR">
<map-reduce>
<job-tracker>localhost:8032</job-tracker>
<name-node>hdfs://localhost:8020</name-node>

<prepare>
<delete path="/user/joe/data/output"/>
</prepare>

<configuration>
<property>
<name>mapred.mapper.class</name>
<value>org.apache.hadoop.mapred.lib.IdentityMapper</value>
</property>
<property>
<name>mapred.reducer.class</name>
<value>org.apache.hadoop.mapred.lib.IdentityReducer</value>
</property>
<property>
<name>mapred.input.dir</name>
<value>/user/joe/data/input</value>
</property>
<property>
<name>mapred.output.dir</name>
<value>/user/joe/data/input</value>
</property>
</configuration>

</map-reduce>
<ok to="success"/>
<error to="fail"/>
</action>
```

###Java
**Main-class.jar**

```xml
<workflow-app name="[WF-DEF-NAME]" xmlns="uri:oozie:workflow:0.1">
    ...
    <action name="[NODE-NAME]">
        <java>
            <job-tracker>[JOB-TRACKER]</job-tracker>
            <name-node>[NAME-NODE]</name-node>
            <prepare>
               <delete path="[PATH]"/>
               ...
               <mkdir path="[PATH]"/>
               ...
            </prepare>
            <job-xml>[JOB-XML]</job-xml>
            <configuration>
                <property>
                    <name>[PROPERTY-NAME]</name>
                    <value>[PROPERTY-VALUE]</value>
                </property>
                ...
            </configuration>
            <main-class>[MAIN-CLASS]</main-class>
			<java-opts>[JAVA-STARTUP-OPTS]</java-opts>
			<arg>ARGUMENT</arg>
            ...
            <file>[FILE-PATH]</file>
            ...
            <archive>[FILE-PATH]</archive>
            ...
            <capture-output />
        </java>
        <ok to="[NODE-NAME]"/>
        <error to="[NODE-NAME]"/>
    </action>
    ...
```
###Hive 
**Hivescript.hpl**
```
ADD JAR /tmp/HiveSwarm-1.0-SNAPSHOT.jar;
create temporary function dayofweek as 'com.livingsocial.hive.udf.DayOfWeek';
select *, dayofweek(to_date('2014-05-02')) from test_table
where age>${age} order by name;
```
**syntax**
```xml
<workflow-app name="[WF-DEF-NAME]" xmlns="uri:oozie:workflow:0.1">
    ...
    <action name="[NODE-NAME]">
        <hive xmlns="uri:oozie:hive-action:0.2">
            <job-tracker>[JOB-TRACKER]</job-tracker>
            <name-node>[NAME-NODE]</name-node>
            <prepare>
               <delete path="[PATH]"/>
               ...
               <mkdir path="[PATH]"/>
               ...
            </prepare>
            <job-xml>[HIVE SETTINGS FILE]</job-xml>
            <configuration>
                <property>
                    <name>[PROPERTY-NAME]</name>
                    <value>[PROPERTY-VALUE]</value>
                </property>
                ...
            </configuration>
            <script>[HIVE-SCRIPT]</script>
            <param>[PARAM-VALUE]</param>
                ...
            <param>[PARAM-VALUE]</param>
            <file>[FILE-PATH]</file>
            ...
            <archive>[FILE-PATH]</archive>
            ...
        </hive>
        <ok to="[NODE-NAME]"/>
        <error to="[NODE-NAME]"/>
    </action>
    ...
</workflow-app>
```
###Pig
**Pigscript.pig**
```
REGISTER myudfs.jar;
data = LOAD '/user/joe/pig/input/data.txt' USING PigStorage(',') AS
(user, age, salary);
filtered_data = FILTER data BY age > $age;
ordered_data = ORDER filtered_data BY salary;
final_data = FOREACH ordered_data GENERATE (user, age,
myudfs.multiply_salary(salary));
STORE final_data INTO '$output' USING PigStorage();
```
**syntax**
```xml
<workflow-app name="[WF-DEF-NAME]" xmlns="uri:oozie:workflow:0.2">
    ...
    <action name="[NODE-NAME]">
        <pig>
            <job-tracker>[JOB-TRACKER]</job-tracker>
            <name-node>[NAME-NODE]</name-node>
            <prepare>
               <delete path="[PATH]"/>
               ...
               <mkdir path="[PATH]"/>
               ...
            </prepare>
            <job-xml>[JOB-XML-FILE]</job-xml>
            <configuration>
                <property>
                    <name>[PROPERTY-NAME]</name>
                    <value>[PROPERTY-VALUE]</value>
                </property>
                ...
            </configuration>
            <script>[PIG-SCRIPT]</script>
            <param>[PARAM-VALUE]</param>
                ...
            <param>[PARAM-VALUE]</param>
            <argument>[ARGUMENT-VALUE]</argument>
                ...
            <argument>[ARGUMENT-VALUE]</argument>
            <file>[FILE-PATH]</file>
            ...
            <archive>[FILE-PATH]</archive>
            ...
        </pig>
        <ok to="[NODE-NAME]"/>
        <error to="[NODE-NAME]"/>
    </action>
    ...
</workflow-app>
```
### FS
**syntax**
```xml
<workflow-app name="[WF-DEF-NAME]" xmlns="uri:oozie:workflow:0.5">
    ...
    <action name="[NODE-NAME]">
        <fs>
            <delete path='[PATH]'/>
            ...
            <mkdir path='[PATH]'/>
            ...
            <move source='[SOURCE-PATH]' target='[TARGET-PATH]'/>
            ...
            <chmod path='[PATH]' permissions='[PERMISSIONS]' dir-files='false' />
            ...
            <touchz path='[PATH]' />
            ...
            <chgrp path='[PATH]' group='[GROUP]' dir-files='false' />
        </fs>
        <ok to="[NODE-NAME]"/>
        <error to="[NODE-NAME]"/>
    </action>
    ...
</workflow-app>
```
###Subworkflow
**syntax**
```xml
<workflow-app name="[WF-DEF-NAME]" xmlns="uri:oozie:workflow:0.1">
    ...
    <action name="[NODE-NAME]">
        <sub-workflow>
            <app-path>[WF-APPLICATION-PATH]</app-path>
            <propagate-configuration/>
            <configuration>
                <property>
                    <name>[PROPERTY-NAME]</name>
                    <value>[PROPERTY-VALUE]</value>
                </property>
                ...
            </configuration>
        </sub-workflow>
        <ok to="[NODE-NAME]"/>
        <error to="[NODE-NAME]"/>
    </action>
    ...
</workflow-app>
```

**Example**
```xml
<workflow-app name="sample-wf" xmlns="uri:oozie:workflow:0.1">
    ...
    <action name="a">
        <sub-workflow>
            <app-path>child-wf</app-path>
            <configuration>
                <property>
                    <name>input.dir</name>
                    <value>${wf:id()}/second-mr-output</value>
                </property>
            </configuration>
        </sub-workflow>
        <ok to="end"/>
        <error to="kill"/>
    </action>
    ...
</workflow-app>
```
###DistCp
**Syntax**
```xml
<workflow-app name="[WF-DEF-NAME]" xmlns="uri:oozie:workflow:0.4">
    ...
    <action name="[NODE-NAME]">
        <distcp xmlns="uri:oozie:distcp-action:0.2">
            <job-tracker>${jobTracker}</job-tracker>
            <name-node>${nameNode1}</name-node>
            <arg>${nameNode1}/path/to/input.txt</arg>
            <arg>${nameNode2}/path/to/output.txt</arg>
            </distcp>
        <ok to="[NODE-NAME]"/>
        <error to="[NODE-NAME]"/>
    </action>
    ...
</workflow-app>
```
**Example**
```xml
```
###Email
**Syntax**
```xml
<workflow-app name="[WF-DEF-NAME]" xmlns="uri:oozie:workflow:0.1">
    ...
    <action name="[NODE-NAME]">
        <email xmlns="uri:oozie:email-action:0.2">
            <to>[COMMA-SEPARATED-TO-ADDRESSES]</to>
            <cc>[COMMA-SEPARATED-CC-ADDRESSES]</cc> <!-- cc is optional -->
            <subject>[SUBJECT]</subject>
            <body>[BODY]</body>
            <content_type>[CONTENT-TYPE]</content_type> <!-- content_type is optional -->
            <attachment>[COMMA-SEPARATED-HDFS-FILE-PATHS]</attachment> <!-- attachment is optional -->
        </email>
        <ok to="[NODE-NAME]"/>
        <error to="[NODE-NAME]"/>
    </action>
    ...
</workflow-app>
```
**Example**
```xml
<workflow-app name="sample-wf" xmlns="uri:oozie:workflow:0.1">
    ...
    <action name="an-email">
        <email xmlns="uri:oozie:email-action:0.1">
            <to>bob@initech.com,the.other.bob@initech.com</to>
            <cc>will@initech.com</cc>
            <subject>Email notifications for ${wf:id()}</subject>
            <body>The wf ${wf:id()} successfully completed.</body>
        </email>
        <ok to="myotherjob"/>
        <error to="errorcleanup"/>
    </action>
    ...
</workflow-app>
```
###Shell
**Syntax**
```xml
<workflow-app name="[WF-DEF-NAME]" xmlns="uri:oozie:workflow:0.3">
    ...
    <action name="[NODE-NAME]">
        <shell xmlns="uri:oozie:shell-action:0.1">
            <job-tracker>[JOB-TRACKER]</job-tracker>
            <name-node>[NAME-NODE]</name-node>
            <prepare>
               <delete path="[PATH]"/>
               ...
               <mkdir path="[PATH]"/>
               ...
            </prepare>
            <job-xml>[SHELL SETTINGS FILE]</job-xml>
            <configuration>
                <property>
                    <name>[PROPERTY-NAME]</name>
                    <value>[PROPERTY-VALUE]</value>
                </property>
                ...
            </configuration>
            <exec>[SHELL-COMMAND]</exec>
            <argument>[ARG-VALUE]</argument>
                ...
            <argument>[ARG-VALUE]</argument>
            <env-var>[VAR1=VALUE1]</env-var>
               ...
            <env-var>[VARN=VALUEN]</env-var>
            <file>[FILE-PATH]</file>
            ...
            <archive>[FILE-PATH]</archive>
            ...
            <capture-output/>
        </shell>
        <ok to="[NODE-NAME]"/>
        <error to="[NODE-NAME]"/>
    </action>
    ...
</workflow-app>
```
**Example**
```xml
<workflow-app xmlns='uri:oozie:workflow:0.3' name='shell-wf'>
    <start to='shell1' />
    <action name='shell1'>
        <shell xmlns="uri:oozie:shell-action:0.1">
            <job-tracker>${jobTracker}</job-tracker>
            <name-node>${nameNode}</name-node>
            <configuration>
                <property>
                  <name>mapred.job.queue.name</name>
                  <value>${queueName}</value>
                </property>
            </configuration>
            <exec>${EXEC}</exec>
            <argument>A</argument>
            <argument>B</argument>
            <file>${EXEC}#${EXEC}</file> <!--Copy the executable to compute node's current working directory -->
        </shell>
        <ok to="end" />
        <error to="fail" />
    </action>
    <kill name="fail">
        <message>Script failed, error message[${wf:errorMessage(wf:lastErrorNode())}]</message>
    </kill>
    <end name='end' />
</workflow-app>
```
**job.properties**
```xml
oozie.wf.application.path=hdfs://localhost:8020/user/kamrul/workflows/script#Execute is expected to be in the Workflow directory.
#Shell Script to run
EXEC=script.sh
#CPP executable. Executable should be binary compatible to the compute node OS.
#EXEC=hello
#Perl script
#EXEC=script.pl
jobTracker=localhost:8021
nameNode=hdfs://localhost:8020
queueName=default
```
###SSH
**Syntax**
```xml
<workflow-app name="[WF-DEF-NAME]" xmlns="uri:oozie:workflow:0.1">
    ...
    <action name="[NODE-NAME]">
        <ssh xmlns="uri:oozie:ssh-action:0.1">
            <host>[USER]@[HOST]</host>
            <command>[SHELL]</command>
            <args>[ARGUMENTS]</args>
            ...
            <capture-output/>
        </ssh>
        <ok to="[NODE-NAME]"/>
        <error to="[NODE-NAME]"/>
    </action>
    ...
</workflow-app>
```
**Example**
```xml
<workflow-app name="sample-wf" xmlns="uri:oozie:workflow:0.1">
    ...
    <action name="myssjob">
        <ssh xmlns="uri:oozie:ssh-action:0.1">
            <host>foo@bar.com<host>
            <command>uploaddata</command>
            <args>jdbc:derby://bar.com:1527/myDB</args>
            <args>hdfs://foobar.com:8020/usr/tucu/myData</args>
        </ssh>
        <ok to="myotherjob"/>
        <error to="errorcleanup"/>
    </action>
    ...
</workflow-app>
```
###sqoop
**Syntax**
```xml
<workflow-app name="[WF-DEF-NAME]" xmlns="uri:oozie:workflow:0.1">
    ...
    <action name="[NODE-NAME]">
        <sqoop xmlns="uri:oozie:sqoop-action:0.2">
            <job-tracker>[JOB-TRACKER]</job-tracker>
            <name-node>[NAME-NODE]</name-node>
            <prepare>
               <delete path="[PATH]"/>
               ...
               <mkdir path="[PATH]"/>
               ...
            </prepare>
            <configuration>
                <property>
                    <name>[PROPERTY-NAME]</name>
                    <value>[PROPERTY-VALUE]</value>
                </property>
                ...
            </configuration>
            <command>[SQOOP-COMMAND]</command>
            <arg>[SQOOP-ARGUMENT]</arg>
            ...
            <file>[FILE-PATH]</file>
            ...
            <archive>[FILE-PATH]</archive>
            ...
        </sqoop>
        <ok to="[NODE-NAME]"/>
        <error to="[NODE-NAME]"/>
    </action>
    ...
</workflow-app>
```
**Example1**
```xml
<workflow-app name="sample-wf" xmlns="uri:oozie:workflow:0.1">
    ...
    <action name="myfirsthivejob">
        <sqoop xmlns="uri:oozie:sqoop-action:0.2">
            <job-tracker>foo:8021</job-tracker>
            <name-node>bar:8020</name-node>
            <prepare>
                <delete path="${jobOutput}"/>
            </prepare>
            <configuration>
                <property>
                    <name>mapred.compress.map.output</name>
                    <value>true</value>
                </property>
            </configuration>
            <command>import  --connect jdbc:hsqldb:file:db.hsqldb --table TT --target-dir hdfs://localhost:8020/user/tucu/foo -m 1</command>
        </sqoop>
        <ok to="myotherjob"/>
        <error to="errorcleanup"/>
    </action>
    ...
</workflow-app>
```
**Example2**
```xml
<workflow-app name="sample-wf" xmlns="uri:oozie:workflow:0.1">
    ...
    <action name="myfirsthivejob">
        <sqoop xmlns="uri:oozie:sqoop-action:0.2">
            <job-tracker>foo:8021</job-tracker>
            <name-node>bar:8020</name-node>
            <prepare>
                <delete path="${jobOutput}"/>
            </prepare>
            <configuration>
                <property>
                    <name>mapred.compress.map.output</name>
                    <value>true</value>
                </property>
            </configuration>
            <arg>import</arg>
            <arg>--connect</arg>
            <arg>jdbc:hsqldb:file:db.hsqldb</arg>
            <arg>--table</arg>
            <arg>TT</arg>
            <arg>--target-dir</arg>
            <arg>hdfs://localhost:8020/user/tucu/foo</arg>
            <arg>-m</arg>
            <arg>1</arg>
        </sqoop>
        <ok to="myotherjob"/>
        <error to="errorcleanup"/>
    </action>
    ...
</workflow-app>
```
## Coordinator
An Oozie coordinator **schedules workflow executions** based on a **start-time** and a **frequency**
parameter, and it starts the workflow when all the necessary input data
becomes available.
## Bunddle
An Oozie bundle is a **collection of coordinator jobs** that can be started, stopped, suspended,
and modified as a single job. Typically, coordinator jobs in a bundle **depend
on each other**.
