 @echo off
:: 设置压缩JS文件的根目录，脚本会自动按树层次查找和压缩所有的JS
SET JSFOLDER=%~dp0
	npm cache clean && gulp --max-old-space-size=8192
echo 完成!
