import React, { useRef, useState, useLayoutEffect } from 'react';
import Fetch from 'src/lib/server/fetch';
import { Table, Tag, Space, Button, Modal, Form, Input, message, Upload } from 'antd';
import './slink.less';

function JsErrorList() {
  const [list, setList] = useState<any>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [link, setLink] = useState('');
  const [keyword, setKeyword] = useState('');
  const pageRef = useRef({
    page:1,
    pageSize: 100,
    count: 0
  })
  const getList = async ()=>{
    let res = await Fetch.post('/slink/list.rjson', {
      page: pageRef.current.page,
      pageSize: pageRef.current.pageSize
    })
    setList(res.list);
  }
  useLayoutEffect(()=>{
    getList()
  }, [])

  const onAdd = async ()=>{
    if(!keyword) {
      return message.info('请输入关键字')
    }
    if(!link) {
      return message.info('请输入链接')
    }
    let res = await Fetch.post('/slink/add.rjson', {
      keyword: keyword,
      link: link
    })
    setKeyword('');
    setLink('');
    setShowAdd(false);
    getList();
  }

  const onDel = async (record:any)=>{
    Modal.confirm({
      title: '确认删除?',
      content: '确认删除这个短链吗',
      onOk: async() =>{
        let res = await Fetch.post('/slink/del.rjson', {
          id: record.id
        })
        getList();
      },
      onCancel() {
        console.log('Cancel');
      },
    })
    
  }

  const columns = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      key: 'keyword',
      render: (text:any) => <a>{text}</a>,
    },
    {
      title: 'link',
      dataIndex: 'link',
      key: 'link',
    },
    {
      title: 'slink',
      dataIndex: 'slink',
      key: 'slink',
      render: (text:any) => {
        let slink = `${window.origin}/slink/jump/${text}`; // `https://crmlog.superboss.cc/slink/jump/${text}`;
        return <a href={slink} target="_blank" rel="noreferrer">{slink}</a>
      },
    },
    {
      title: 'create',
      dataIndex: 'create',
      key: 'create',
    },
    {
      title: 'visit',
      dataIndex: 'visit',
      key: 'visit',
    },
    // {
    //   title: 'Tags',
    //   key: 'tags',
    //   dataIndex: 'tags',
    //   render: (tags:any) => (
    //     <>
    //       {tags.map((tag:any) => {
    //         let color = tag.length > 5 ? 'geekblue' : 'green';
    //         if (tag === 'loser') {
    //           color = 'volcano';
    //         }
    //         return (
    //           <Tag color={color} key={tag}>
    //             {tag.toUpperCase()}
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   ),
    // },
    {
      title: 'Action',
      key: 'action',
      render: (text:any, record:any) => (
        <Space size="middle">
          <a onClick={()=>{ onDel(record) }}>Delete</a>
        </Space>
      ),
    },
  ];

  const UploadProps:any = {
    name: 'file',
    action:"/file/form.rjson",
    method: "POST",
    listType: 'picture',
    showUploadList:false,
    onChange:(info:any)=> {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        // this.setState({
        //   picUrl:info.file.response.data,
        // })
        console.log(info);
        message.success(`上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.response.data} 上传失败`);
      }
    },
  };

  return (
    <div className="main slink-list">
      <div className="content-heaer">
        <Button type="primary" onClick={()=>{setShowAdd(true)}}>新建</Button>
      </div>
      <Table columns={columns} dataSource={list} />
      <Modal title="新建短链" 
        visible={showAdd} 
        onOk={()=>{
          setShowAdd(false);
          getList();
        }} 
        onCancel={()=>{
          setShowAdd(false);
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            label="关键字"
            name="keyword"
          >
            <Input value={keyword} onChange={e=> setKeyword(e.target.value) }/>
          </Form.Item>

          <Form.Item
            label="链接"
            name="link"
          >
            <Input value={link} onChange={e=> setLink(e.target.value) }/>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" onClick={onAdd}>
              生成链接
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div className="upload">
        <h2>Antd Upload</h2>
        <Upload {...UploadProps} >
          <Button type="primary" >
              上传图片
          </Button>
        </Upload>
      </div>
    </div>
  );
}

export default JsErrorList;
