import axios from "axios";
import Fetch from 'src/lib/server/fetch'

const DEFAULT_SIZE = 1 * 1024 * 1024; // 2M

type ChunkType = {
  file: Blob,
  fileName: string,
  chunkName: string,
}
/** 创建切片 */
export function createChunk(file: File, size = DEFAULT_SIZE) {//两个形参：file是大文件，size是切片的大小
  const chunkList = []
  const time = new Date().getTime();
  let cur = 0;
  let index = 0;
  const [fileName, ext] = file.name.split('.');
  while (cur < file.size) {
    index++
    chunkList.push({
      file: file.slice(cur, cur + size),
      fileName: file.name,
      chunkName: `${fileName}-${time}-${index}`,
    })
    cur += size
  }
  return chunkList
}

/** 上传切片 */
const uploadChunk = async (chunk: ChunkType) => {
  const formData = new FormData();
  formData.append('fileName', chunk.chunkName);
  // formData.append('chunkName', chunk.chunkName);
  formData.append('file', chunk.file);
  const res = await axios({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    url: '/file/upload/chunk.rjson',
    data: formData,
  })
  console.log(res);
}

/** 上传大文件 */
export const uploadBigFile = async (file: File) => {

  // 创建切片
  const chunklist = createChunk(file)
  console.log(chunklist)
  // 上传切片 一个接一个上传
  for (let i = 0; i < chunklist.length; i++){
    await uploadChunk(chunklist[i])
  }
  
  // 并发
  // chunklist.forEach(async (chunk, index) => {
  //   await uploadChunk(chunk)
  // })

  // 上传完毕 告知服务端
  let res = await Fetch.post('/file/merge.rjson', {
    fileName: file.name,
    chunklist: chunklist.map(chunk => chunk.chunkName),
    size: DEFAULT_SIZE
  });
  console.log('上传成功')
  return res
}