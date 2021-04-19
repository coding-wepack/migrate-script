## Nexus to CODING 

```
docker run  -it --rm coding-public-docker.pkg.coding.net/wepack/docker/nexus-to-coding:0.4.0 \
--source <Nexus 仓库地址，如 http://9.134.66.12:8081/repository/maven-releases/> \
--source-username <Nexus 访问账号> \
--source-password <Nexus 访问密码> \
--target <CODING 制品仓库地址，如 https://myteam-maven.pkg.coding.net/repository/my-project/my-repo/> \
--target-username <CODING 制品仓库访问账号> \
--target-password <CODING 制品仓库访问密码> \
--source-version nexus-2 
--type maven
```


## TODO

- NPM
- Docker
- PyPI