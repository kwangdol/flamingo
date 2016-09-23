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
```xml
<workflow-app xmlns="uri:oozie:workflow:0.5" name="simpleWF">
<global>
...
</global>
<start to="echoA"/>
<action name="echoA">
<shell xmlns="uri:oozie:shell-action:0.2">
...
</shell>
<ok to="echoB"/>
<error to="done"/>
</action>
<action name="echoB">
<shell xmlns="uri:oozie:shell-action:0.2">
...
</shell>
<ok to="done"/>
<error to="done"/>
</action>
<end name="done"/>
</workflow-app>
```
- **fork and join**
```xml
<workflow-app xmlns="uri:oozie:workflow:0.5" name="forkJoinNodeWF">
<global>
...
</global>
<start to="forkActions"/>
<fork name="forkActions">
<path name="echoA"/>
<path name="echoB"/>
</fork>
<action name="echoA">
<shell xmlns="uri:oozie:shell-action:0.2">
...
</shell>
<ok to="joinActions"/>
<error to="joinActions"/>
</action>
<action name="echoB">
<shell xmlns="uri:oozie:shell-action:0.2">
...
</shell>
<ok to="joinActions"/>
<error to="joinActions"/>
</action>
<join name="joinActions" to="done"/>
<end name="done"/>
</workflow-app>
```
- decision
- kill
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
###Jave
###Hive
###Pig
## Coordinator
## Bunddle
