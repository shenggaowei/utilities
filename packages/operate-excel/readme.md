# excel 文件处理

读取图片名称，并按照文件夹和其类别生成对应的 excel 以及 excel 下不同的 sheet。

## 1 使用环境

node >= 14.14.0

## 2 使用方式

```shell
 node lib/index --option
```

```log
Usage: index [options]

Options:
  -t, --type <type>  add a generate type (default: "L")
```

将观察者的图片数据放到 input 文件夹下，目录格式如下所示。

```log
---input
    ---L
        ---L150
            ---caoxuheng
                ---xxxx.tif
    ---C
    ---H
```

脚本读取 input 文件夹内容， input 下的文件夹（L|C|H）对应一个 excel, L、C、H文件夹下的每个文件夹对应一个 sheet。

脚本目前每次只能生成一个 excel， 所以需要传入 --type 匹配 input 下的文件夹

生成的 excel 默认存放到项目的 output 目录下。
