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
- **decision**
- **kill**
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
###Hive 
**Hivescript.hpl**


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
**Action node**
```xml
<action name="myPigAction">
<pig>
<job-tracker>jt.mycompany.com:8032</job-tracker>
<name-node>hdfs://nn.mycompany.com:8020</name-node>
<prepare>
<delete path="hdfs://nn.mycompany.com:8020/hdfs/user/
joe/pig/output"/>
</prepare>
<configuration>
<property>
<name>mapred.job.queue.name</name>
<value>research</value>
</property>
</configuration>

<script>pig.script</script>
<argument>-param</argument>
<argument>age=30</argument>
<argument>-param</argument>
<argument>output=hdfs://nn.mycompany.com:8020/hdfs/user/
joe/pig/output</argument>
</pig>

<ok to="end"/>
<error to="fail"/>
</action>
```
## Coordinator
## Bunddle
