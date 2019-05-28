# 安装 astel-cli

tnpm install -g @tencent/astel-cli

## 查看模板列表
```
astel list
```

## 下载列表中的模板
```
astel init <模板前缀> <模板名称>

例：astel init A a20190424cos
```
## 启动列表中的模板
```
astel serve <模板名称>

例：astel serve a20190424cos
```


## 将模块插入到模板中(目前只支持大厅活动模板)
### 其中模板名称就是下载模板时所输入的名称
```
astel insert <模块名,模块名,模块名...> <模板名称>

例：astel insert M-list a20190424cos
```

