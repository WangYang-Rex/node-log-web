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

  const onRankClick = async () => {
    let res = await Fetch.post('/rank/addrank.rjson', {
      "record_date": "10-10",
      "total_users": "1000",
      "rank_list": [{ "login": "ruanyf", "name": "Ruan YiFeng", "location": "Shanghai, China", "company": "", "blog": "https://twitter.com/ruanyf", "email": "yifeng.ruan@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/905434?v=4", "followers": 72697 }, { "login": "michaelliao", "name": "Michael Liao", "location": "Beijing, China", "company": "liaoxuefeng.com", "blog": "https://www.liaoxuefeng.com", "email": "askxuefeng@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/470058?v=4", "followers": 35372 }, { "login": "daimajia", "name": "代码家", "location": "Beijing, China", "company": "ZhenFund Beijing", "blog": "daimajia.com", "email": "daimajia@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/2503423?v=4", "followers": 24138 }, { "login": "JacksonTian", "name": "Jackson Tian", "location": "Hangzhou, China", "company": "Alibaba Cloud", "blog": "http://jacksontian.org/", "email": "shyvo1987@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/327019?v=4", "followers": 20792 }, { "login": "phodal", "name": "Fengda Huang", "location": "Shanghai / Hangzhou, China", "company": "@thoughtworks", "blog": "https://www.phodal.com/", "email": "h@phodal.com", "avatar_url": "https://avatars.githubusercontent.com/u/472311?v=4", "followers": 18684 }, { "login": "cloudwu", "name": "云风", "location": "China", "company": "ejoy.com", "blog": "http://blog.codingnow.com", "email": "cloudwu@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/729648?v=4", "followers": 18516 }, { "login": "programthink", "name": "编程随想", "location": "China", "company": "", "blog": "https://program-think.blogspot.com/", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/4027957?v=4", "followers": 16326 }, { "login": "stormzhang", "name": "stormzhang", "location": "Shanghai, China", "company": "Boohee, Inc.", "blog": "http://stormzhang.com", "email": "stormzhang.dev@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/2267900?v=4", "followers": 15825 }, { "login": "justjavac", "name": "迷渡", "location": "Tianjin, China", "company": "", "blog": "https://twitter.com/justjavac", "email": "justjavac@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/359395?v=4", "followers": 15681 }, { "login": "lifesinger", "name": "lifesinger", "location": "Hangzhou, China", "company": "", "blog": "", "email": "lifesinger@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/97227?v=4", "followers": 15566 }, { "login": "onevcat", "name": "Wei Wang", "location": "Yokohama, Japan / China", "company": "LINE Corp.", "blog": "https://onev.cat", "email": "onevcat@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/1019875?v=4", "followers": 14830 }, { "login": "halfrost", "name": "halfrost", "location": "[California, Singapore, China]", "company": "@CNCF", "blog": "https://halfrost.com", "email": "i@halfrost.com", "avatar_url": "https://avatars.githubusercontent.com/u/10825609?v=4", "followers": 14814 }, { "login": "astaxie", "name": "astaxie", "location": "Shanghai, China", "company": "jimengIO", "blog": "http://beego.vip", "email": "xiemengjun@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/233907?v=4", "followers": 14668 }, { "login": "RubyLouvre", "name": "司徒正美", "location": "China", "company": "qunar.com", "blog": "http://www.cnblogs.com/rubylouvre/", "email": "cheng19840218@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/190846?v=4", "followers": 14456 }, { "login": "Ovilia", "name": "Wenli Zhang", "location": "Shanghai, China", "company": "", "blog": "http://zhangwenli.com", "email": "me@zhangwenli.com", "avatar_url": "https://avatars.githubusercontent.com/u/779050?v=4", "followers": 14204 }, { "login": "CyC2018", "name": "CyC2018", "location": "Guangzhou, China", "company": "@ByteDance", "blog": "https://dwz.cn/H5R7WDSN", "email": "zhengyc101@163.com", "avatar_url": "https://avatars.githubusercontent.com/u/36260787?v=4", "followers": 13725 }, { "login": "bailicangdu", "name": "cangdu", "location": "Shanghai, China", "company": "jd.com", "blog": "https://github.com/bailicangdu", "email": "1264889788@qq.com", "avatar_url": "https://avatars.githubusercontent.com/u/20297227?v=4", "followers": 13172 }, { "login": "breakwa11", "name": "破娃酱", "location": "喵嗷污, China", "company": "", "blog": "", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/8436963?v=4", "followers": 13114 }, { "login": "jackfrued", "name": "骆昊", "location": "Chengdu Sichuan, China", "company": "", "blog": "http://blog.csdn.net/jackfrued", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/7474657?v=4", "followers": 13075 }, { "login": "unknwon", "name": "Joe Chen", "location": "Shanghai, China", "company": "@sourcegraph", "blog": "https://unknwon.io", "email": "jc@unknwon.io", "avatar_url": "https://avatars.githubusercontent.com/u/2946214?v=4", "followers": 12992 }, { "login": "hongyangAndroid", "name": "张鸿洋", "location": "Beijing,China", "company": "wanandroid.com", "blog": "http://www.wanandroid.com", "email": "623565791@qq.com", "avatar_url": "https://avatars.githubusercontent.com/u/10704521?v=4", "followers": 12817 }, { "login": "laruence", "name": "Xinchen Hui", "location": "Beijing, China", "company": "", "blog": "http://www.laruence.com", "email": "laruence@php.net", "avatar_url": "https://avatars.githubusercontent.com/u/382813?v=4", "followers": 12154 }, { "login": "draveness", "name": "Draven", "location": "Beijing, China", "company": "@kubernetes ", "blog": "https://draveness.me/", "email": "i@draveness.me", "avatar_url": "https://avatars.githubusercontent.com/u/6493255?v=4", "followers": 11872 }, { "login": "fengdu78", "name": "Huang Haiguang", "location": "Qingdao,China", "company": "", "blog": "http://www.ai-start.com", "email": "haiguang2000@qq.com", "avatar_url": "https://avatars.githubusercontent.com/u/26119052?v=4", "followers": 11870 }, { "login": "PanJiaChen", "name": "花裤衩", "location": "Shanghai, China", "company": "ByteDance", "blog": "", "email": "panfree23@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/8121621?v=4", "followers": 11499 }, { "login": "fouber", "name": "张云龙", "location": "China", "company": "巧子科技", "blog": "https://github.com/fouber/blog", "email": "fouber.NET@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/536297?v=4", "followers": 10938 }, { "login": "egoist", "name": "EGOIST", "location": "China", "company": "Mom's basement", "blog": "https://egoist.dev", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/8784712?v=4", "followers": 10499 }, { "login": "sofish", "name": "小鱼", "location": "Shanghai China", "company": "", "blog": "http://sofi.sh", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/153183?v=4", "followers": 10277 }, { "login": "mqyqingfeng", "name": "冴羽", "location": "Hangzhou, China", "company": "Taobao FED", "blog": "https://www.zhihu.com/people/qing-feng-yi-yang/posts", "email": "mqyqingfeng@qq.com", "avatar_url": "https://avatars.githubusercontent.com/u/11458263?v=4", "followers": 9921 }, { "login": "miloyip", "name": "Milo Yip", "location": "Hong Kong, China", "company": "Tencent", "blog": "", "email": "miloyip@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/1195774?v=4", "followers": 9870 }, { "login": "YunaiV", "name": "芋道源码", "location": "Shanghai, China", "company": "芋道源码，纯源码解析公众号", "blog": "http://www.iocoder.cn?github", "email": "zhijiantianya@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/2015545?v=4", "followers": 9854 }, { "login": "CoderMJLee", "name": "M了个J", "location": "Guangzhou, China", "company": "小码哥 http://www.520it.com", "blog": "https://www.cnblogs.com/mjios", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/3817366?v=4", "followers": 9564 }, { "login": "QianMo", "name": "浅墨（毛星云）", "location": "Shenzhen, China", "company": "Tencent", "blog": "https://zhuanlan.zhihu.com/game-programming", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/7830161?v=4", "followers": 9524 }, { "login": "ustbhuangyi", "name": "HuangYi", "location": "HeFei,China", "company": "zoom.us", "blog": "", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/5359011?v=4", "followers": 9309 }, { "login": "wintercn", "name": "Shaofei Cheng", "location": "China", "company": "", "blog": "https://space.bilibili.com/8538662", "email": "csf178@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/726566?v=4", "followers": 9130 }, { "login": "dyc87112", "name": "程序猿DD", "location": "Shanghai, China", "company": "", "blog": "https://blog.didispace.com", "email": "dyc87112@qq.com", "avatar_url": "https://avatars.githubusercontent.com/u/3391170?v=4", "followers": 8884 }, { "login": "liyupi", "name": "程序员鱼皮", "location": "China Shanghai", "company": "公众号【程序员鱼皮】", "blog": "https://yupi.icu", "email": "592789970@qq.com", "avatar_url": "https://avatars.githubusercontent.com/u/26037703?v=4", "followers": 8728 }, { "login": "wizardforcel", "name": "布客飞龙", "location": "Beijing, China", "company": "@258ch @ApacheCN ", "blog": "http://wizard.blog.csdn.net", "email": "admin@flygon.net", "avatar_url": "https://avatars.githubusercontent.com/u/5080126?v=4", "followers": 8640 }, { "login": "ityouknow", "name": "纯洁的微笑", "location": "beijing,china", "company": "Freedom and dreams", "blog": "www.ityouknow.com", "email": "ityouknow@126.com", "avatar_url": "https://avatars.githubusercontent.com/u/4979648?v=4", "followers": 8557 }, { "login": "lepture", "name": "Hsiaoming Yang", "location": "Japan & China", "company": "@hsiaoming ", "blog": "https://lepture.com", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/290496?v=4", "followers": 8472 }, { "login": "i5ting", "name": "狼叔", "location": "china beijing", "company": "alibaba", "blog": "http://i5ting.com", "email": "i5ting@126.com", "avatar_url": "https://avatars.githubusercontent.com/u/3118295?v=4", "followers": 8404 }, { "login": "MisterBooo", "name": "吴师兄学算法", "location": "Guangzhou, China", "company": "", "blog": "https://www.cxyxiaowu.com", "email": "278166530@qq.com", "avatar_url": "https://avatars.githubusercontent.com/u/15308811?v=4", "followers": 8037 }, { "login": "fengmk2", "name": "fengmk2", "location": "Hangzhou, China", "company": "Alipay", "blog": "https://www.yuque.com/fengmk2", "email": "fengmk2@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/156269?v=4", "followers": 7863 }, { "login": "rengwuxian", "name": "Kai Zhu", "location": "Zhengzhou, China", "company": "", "blog": "https://rengwuxian.com", "email": "rengwuxian@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/4454687?v=4", "followers": 7811 }, { "login": "drakeet", "name": "Drakeet", "location": "Suzhou, China", "company": "", "blog": "https://writer.drakeet.com", "email": "drakeet@drakeet.com", "avatar_url": "https://avatars.githubusercontent.com/u/5214214?v=4", "followers": 7743 }, { "login": "mercyblitz", "name": "Mercy Ma", "location": "Hangzhou, China", "company": "OpenSource", "blog": "https://mercyblitz.github.io/", "email": "mercyblitz@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/533114?v=4", "followers": 7646 }, { "login": "macrozheng", "name": "macro", "location": "Wuxi,China", "company": "", "blog": "", "email": "macrozheng@126.com", "avatar_url": "https://avatars.githubusercontent.com/u/15903809?v=4", "followers": 7620 }, { "login": "easychen", "name": "Easy", "location": "Chongqing, China", "company": "Windmark.pro", "blog": "http://ftqq.com", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/1294760?v=4", "followers": 7598 }, { "login": "Jack-Cherish", "name": "Jack Cui", "location": "China", "company": "Northeastern University", "blog": "https://cuijiahua.com/", "email": "c411184003@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/16872370?v=4", "followers": 7456 }, { "login": "singwhatiwanna", "name": "singwhatiwanna", "location": "Beijing, China", "company": "DiDi", "blog": "http://renyugang.io", "email": "singwhatiwanna@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/3346272?v=4", "followers": 7316 }, { "login": "liuyubobobo", "name": "Yubo Liu", "location": "USA / China", "company": "", "blog": "http://www.liuyubobobo.com", "email": "liuyubobobo@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/2057443?v=4", "followers": 7233 }, { "login": "pengzhile", "name": "Neo Peng", "location": "China", "company": "", "blog": "https://zhile.io", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/343491?v=4", "followers": 7207 }, { "login": "tangqiaoboy", "name": "Tang Qiao", "location": "Beijing, China", "company": "Yuanfudao", "blog": "https://blog.devtang.com", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/733097?v=4", "followers": 7116 }, { "login": "chokcoco", "name": "Coco", "location": "ShenZhen, China", "company": "Shopee", "blog": "http://www.cnblogs.com/coco1s/", "email": "308695699@qq.com", "avatar_url": "https://avatars.githubusercontent.com/u/8554143?v=4", "followers": 7049 }, { "login": "CarGuo", "name": "Shuyu Guo", "location": "China 广东 珠海", "company": "公众号 GSYTech", "blog": "https://juejin.im/user/582aca2ba22b9d006b59ae68/posts", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/10770362?v=4", "followers": 6904 }, { "login": "xufei", "name": "xufei", "location": "Shanghai, China", "company": "", "blog": "", "email": "xu.fei@outlook.com", "avatar_url": "https://avatars.githubusercontent.com/u/2725159?v=4", "followers": 6713 }, { "login": "overtrue", "name": "安正超", "location": "Shenzhen,China", "company": "Tencent Inc.", "blog": "http://overtrue.me", "email": "anzhengchao@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/1472352?v=4", "followers": 6687 }, { "login": "521xueweihan", "name": "削微寒", "location": "Beijing, China", "company": "公众号：HelloGitHub", "blog": "https://hellogithub.com/", "email": "595666367@qq.com", "avatar_url": "https://avatars.githubusercontent.com/u/8255800?v=4", "followers": 6684 }, { "login": "afc163", "name": "afc163", "location": "Hangzhou, China", "company": "Alipay", "blog": "https://twitter.com/afc163", "email": "afc163@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/507615?v=4", "followers": 6380 }, { "login": "oldratlee", "name": "李鼎", "location": "Hangzhou, Zhejiang, China", "company": "pdd @taobao tmall @aliyun @alibaba", "blog": "", "email": "oldratlee@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/1063891?v=4", "followers": 6264 }, { "login": "shengxinjing", "name": "花果山大圣", "location": "China", "company": "创业中", "blog": "http://www.weibo.com/woniuppp", "email": "316783812@qq.com", "avatar_url": "https://avatars.githubusercontent.com/u/1905176?v=4", "followers": 6260 }, { "login": "yuanming-hu", "name": "Yuanming Hu", "location": "Beijing, China", "company": "Taichi Graphics", "blog": "https://yuanming.taichi.graphics/", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/6553256?v=4", "followers": 5931 }, { "login": "hehonghui", "name": "Mr.Simple", "location": "china", "company": "UIT", "blog": "", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/1683811?v=4", "followers": 5832 }, { "login": "Huxpro", "name": "Xuan Huang (黄玄)", "location": "[CA, NY, ...China]", "company": "@facebook", "blog": "https://huangxuan.me", "email": "huxpro@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/5563315?v=4", "followers": 5766 }, { "login": "qiwsir", "name": "老齐", "location": "Suzhou China", "company": "易水禾软件", "blog": "http://www.itdiffer.com", "email": "qiwsir@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/3646955?v=4", "followers": 5567 }, { "login": "guolindev", "name": "Lin Guo", "location": "Suzhou, China", "company": "Microsoft", "blog": "https://developers.google.com/community/experts/directory/profile/profile-lin-guo", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/20859208?v=4", "followers": 5552 }, { "login": "jaywcjlove", "name": "小弟调调™", "location": "Shanghai, China", "company": "ʕ•̫͡•ʔ-̫͡-ʕ•͓͡•ʔ-̫͡-ʔ", "blog": "https://wangchujiang.com", "email": "kennyiseeyou@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/1680273?v=4", "followers": 5459 }, { "login": "crossoverJie", "name": "crossoverJie", "location": "CHONGQING,CHINA", "company": "", "blog": "https://crossoverjie.top", "email": "crossoverJie@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/15684156?v=4", "followers": 5351 }, { "login": "alsotang", "name": "alsotang", "location": "ShenZhen, China", "company": "Tencent", "blog": "https://alsotang.com/", "email": "alsotang@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/1147375?v=4", "followers": 5165 }, { "login": "labuladong", "name": "labuladong", "location": "Chengdu, China", "company": "", "blog": "https://labuladong.github.io/algo/", "email": "labuladong@foxmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/37220920?v=4", "followers": 5156 }, { "login": "xuxueli", "name": "许雪里", "location": "Shanghai, China", "company": "大众点评", "blog": "https://www.xuxueli.com/", "email": "931591021@qq.com", "avatar_url": "https://avatars.githubusercontent.com/u/10633817?v=4", "followers": 5093 }, { "login": "julycoding", "name": "July", "location": "Beijing, China", "company": "", "blog": "http://blog.csdn.net/v_july_v", "email": "786165179@qq.com", "avatar_url": "https://avatars.githubusercontent.com/u/6184536?v=4", "followers": 5046 }, { "login": "yanhaijing", "name": "颜海镜", "location": "Beijing,China", "company": "https://github.com/jsmini", "blog": "https://yanhaijing.com", "email": "yanhaijing@yeah.net", "avatar_url": "https://avatars.githubusercontent.com/u/3192087?v=4", "followers": 5042 }, { "login": "huangz1990", "name": "黄健宏", "location": "Qingyuan, Guangdong, China", "company": "", "blog": "huangz.me", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/536854?v=4", "followers": 4886 }, { "login": "alibaba", "name": "Alibaba", "location": "Hangzhou, China", "company": "", "blog": "https://www.alibabagroup.com/", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/1961952?v=4", "followers": 4838 }, { "login": "hellokaton", "name": "見える", "location": "ShangHai, China", "company": "@lets-blade", "blog": "", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/3849072?v=4", "followers": 4836 }, { "login": "amusi", "name": "Amusi", "location": "Shanghai, China", "company": "CVer", "blog": "https://www.zhihu.com/people/amusi1994/activities", "email": "1609951733@qq.com", "avatar_url": "https://avatars.githubusercontent.com/u/22436957?v=4", "followers": 4777 }, { "login": "wepe", "name": "wepon", "location": "China Hangzhou", "company": "Ant Group", "blog": "https://scholar.google.com/citations?user=xRKTHmwAAAAJ&hl=zh-CN", "email": "masterwepon@163.com", "avatar_url": "https://avatars.githubusercontent.com/u/9136322?v=4", "followers": 4764 }, { "login": "Fndroid", "name": "Fndroid", "location": "China", "company": "", "blog": "", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/16091562?v=4", "followers": 4752 }, { "login": "akira-cn", "name": "月影", "location": "Beijing,China", "company": "ByteDance", "blog": "https://juejin.cn", "email": "akira.cn@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/316498?v=4", "followers": 4749 }, { "login": "huacnlee", "name": "Jason Lee", "location": "Chengdu, China", "company": "Longbridge", "blog": "", "email": "huacnlee@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/5518?v=4", "followers": 4684 }, { "login": "tiann", "name": "weishu", "location": "China", "company": "", "blog": "https://weishu.me", "email": "twsxtd@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/4233744?v=4", "followers": 4618 }, { "login": "liuhuanyong", "name": "liuhuanyong", "location": "Beijing, China", "company": "China", "blog": "https://liuhuanyong.github.io", "email": "lhy_in_blcu@126.com", "avatar_url": "https://avatars.githubusercontent.com/u/22536595?v=4", "followers": 4572 }, { "login": "HcySunYang", "name": "Chunyang Huo", "location": "Beijing, China", "company": "Microsoft", "blog": "", "email": "HcySunYang@outlook.com", "avatar_url": "https://avatars.githubusercontent.com/u/14146560?v=4", "followers": 4480 }, { "login": "chai2010", "name": "chai2010", "location": "Hangzhou, China", "company": "@alipay @wa-lang", "blog": "", "email": "chaishushan@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/2295542?v=4", "followers": 4478 }, { "login": "atian25", "name": "TZ | 天猪", "location": "GuangZhou, China", "company": "@eggjs  @antgroup", "blog": "http://atian25.github.io/", "email": "atian25@qq.com", "avatar_url": "https://avatars.githubusercontent.com/u/227713?v=4", "followers": 4473 }, { "login": "jinzhu", "name": "Jinzhu", "location": "HangZhou China", "company": "", "blog": "http://patreon.com/jinzhu", "email": "wosmvp@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/6843?v=4", "followers": 4462 }, { "login": "teddysun", "name": "Teddysun", "location": "Shanghai, China", "company": "", "blog": "https://teddysun.com", "email": "i@teddysun.com", "avatar_url": "https://avatars.githubusercontent.com/u/1475030?v=4", "followers": 4433 }, { "login": "skyzh", "name": "Alex Chi", "location": "Pittsburgh, PA, USA ↔️ Shanghai, China", "company": "Carnegie Mellon University", "blog": "https://www.skyzh.dev", "email": "iskyzh@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/4198311?v=4", "followers": 4356 }, { "login": "madeye", "name": "Max Lv", "location": "Shanghai, China", "company": "NVIDIA", "blog": "https://maxlv.net", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/627917?v=4", "followers": 4330 }, { "login": "kesenhoo", "name": "HuKai", "location": "Shanghai , China", "company": "Tencent Inc.", "blog": "http://hukai.me", "email": "kesenhoo@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/1456490?v=4", "followers": 4325 }, { "login": "barretlee", "name": "Barret李靖", "location": "Hangzhou,China", "company": "蚂蚁金服 - 语雀", "blog": "https://barretlee.com", "email": "barret.china@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/2698003?v=4", "followers": 4304 }, { "login": "dead-horse", "name": "Yiyu He", "location": "Hangzhou, China", "company": "@alipay @alibaba @eggjs ", "blog": "https://twitter.com/deadhorse_busi", "email": "heyiyu.deadhorse@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/985607?v=4", "followers": 4303 }, { "login": "azl397985856", "name": "lucifer", "location": "China", "company": "secret", "blog": "https://lucifer.ren/blog", "email": "azl397985856@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/12479470?v=4", "followers": 4247 }, { "login": "oschina", "name": "开源中国", "location": "SZ China", "company": "", "blog": "https://www.oschina.net/", "email": "oschina.net@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/1540855?v=4", "followers": 4237 }, { "login": "lenve", "name": "江南一点雨", "location": "China GuangZhou", "company": "", "blog": "http://www.javaboy.org", "email": "wangsong0210@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/6023444?v=4", "followers": 4205 }, { "login": "Terry-Mao", "name": "Terry.Mao", "location": "China, BeiJing", "company": "bilibili", "blog": "http://space.bilibili.com/6543201/#!/index", "email": "iammao@vip.qq.com", "avatar_url": "https://avatars.githubusercontent.com/u/1627804?v=4", "followers": 4185 }, { "login": "answershuto", "name": "染陌同学", "location": "HangZhou, China", "company": "@Alibaba", "blog": "", "email": "answershuto@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/17812136?v=4", "followers": 4158 }, { "login": "JeffLi1993", "name": "程序员泥瓦匠", "location": "HangZhou, China", "company": "", "blog": "https://www.bysocket.com", "email": "", "avatar_url": "https://avatars.githubusercontent.com/u/6890948?v=4", "followers": 4138 }, { "login": "KieSun", "name": "yck", "location": "Hangzhou, China", "company": "", "blog": "https://yuchengkai.cn", "email": "zx597813039@gmail.com", "avatar_url": "https://avatars.githubusercontent.com/u/11811888?v=4", "followers": 4134 }]
    })
    // setList(res.list);
  }

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
      <Button type="primary" onClick={onRankClick}>
        发送githubrankofchina
      </Button>
    </div>
  );
}

export default JsErrorList;
