# 使用 `mvn`  发布 jar / war 等类型包至 CODING 制品库

可以使用 `mvn` 工具来发布某个包，参考命令如下：

```shell
mvn -s settings.xml deploy:deploy-file -Durl=<url-of-the-repository-to-deploy> \
                                       -DrepositoryId=<id-to-map-on-server-section-of-settings.xml> \
                                       -Dfile=<path-to-file> \
                                       [-DpomFile=your-pom.xml] \
                                       [-DgroupId=<group-id>] \
                                       [-DartifactId=<artifact-id>] \
                                       [-Dversion=<version>] \
                                       [-Dpackaging=<type-of-packaging>] \
                                       [-Dclassifier=test] \
                                       [-DgeneratePom=true] \
                                       [-DgeneratePom.description="description"] \
                                       [-DrepositoryLayout=legacy]
```

以上 `url`, `repositoryId` 以及 `file` 为必填，剩下的可选。其中 `generatePom` 默认值为 `true`。

举例说明如何上传一个 `war` 包至 CODING Maven 制品仓库（其他类型如 `jar` 包一致）：

<settings.xml>:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">

    <servers>
        <server>
            <id>codingcorp-registry-central</id>
            <username>coding@coding.com</username>
            <password>[password]</password>
        </server>
    </servers>

</settings>
```

命令：

```shell
mvn -s settings.xml deploy:deploy-file -Durl=http://codingcorp-maven.pkg.coding.manso.live/repository/registry/central/ \
... ❯ -DrepositoryId=codingcorp-registry-central \
... ❯ -Dfile=target/hello-webapp.war \
... ❯ -DgroupId=net.coding.web \
... ❯ -DartifactId=hello-webapp \
... ❯ -Dversion=1.0.0 \
... ❯ -DgeneratePom=true
```

之后如若提示 `[INFO] BUILD SUCCESS` 则表明我们已经成功上传，并自动生成了类似如下的一个 `pom.xml` 文件：

```shell
curl -u coding:password 'http://codingcorp-maven.pkg.coding.manso.live/repository/registry/central/net/coding/web/hello-webapp/1.0.0/hello-webapp-1.0.0.pom'
<?xml version="1.0" encoding="UTF-8"?>
<project xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd" xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <modelVersion>4.0.0</modelVersion>
  <groupId>net.coding.web</groupId>
  <artifactId>hello-webapp</artifactId>
  <version>1.0.0</version>
  <packaging>war</packaging>
</project>
```



