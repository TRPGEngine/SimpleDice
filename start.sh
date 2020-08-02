#!/bin/bash
echo "正在编译前端文件..."
(cd client && npm install && npm run build)

echo "正在启动后端服务器..."
(cd server && npm install && npm start)
