 @echo off
:: ����ѹ��JS�ļ��ĸ�Ŀ¼���ű����Զ�������β��Һ�ѹ�����е�JS
SET JSFOLDER=%~dp0
	npm cache clean && gulp --max-old-space-size=8192
echo ���!
