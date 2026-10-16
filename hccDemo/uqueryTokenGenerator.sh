#add the zoocfg dir to classpath
CLASSPATH=""
for i in WEB-INF/lib/*.jar
do
    CLASSPATH="$i:$CLASSPATH"
done
CLASSPATH="WEB-INF/classes:$CLASSPATH"
echo "hello"
echo "java -cp $CLASSPATH com.huawei.datasight.ai.demo.util.TokenGenerator"
java -cp "$CLASSPATH" com.huawei.datasight.ai.demo.util.TokenGenerator