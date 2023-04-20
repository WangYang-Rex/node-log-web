import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
// import Fetch from 'src/lib/server/fetch'
import { Button, Input } from 'antd';
import SpeechRecognitionTool from './SpeechRecognitionTool'
import './voiceInput.less'

declare const window: any;

// const { TextArea } = Input;

const VoiceInput = () => {
  const [text, setText] = useState<string>('');
  const [list, setList] = useState<string[]>([
    '语音转文字，关键指令：发送、回车',
    '点击 speak，进行语音合成',
    'What is your favorite color?',
    "I'm sorry, I didn't catch that.",
  ]);
  const [s, setS] = useState('');

  const ref = useRef<any>({
    SpeechRecognition: null
  });

  useEffect(() => {
    init()
  }, [])

  const init = () => {

    ref.current.SpeechRecognition = new SpeechRecognitionTool({
      onTextChange: (text: string) => {
        setText(text);
      },
      onSend: onSend
    });
  }

  const start = () => {
    ref.current.SpeechRecognition.start();
  }

  const end = () => {
    ref.current.SpeechRecognition.end();
  }

  const onSend = (_text?: string) => {
    const __text = _text || text;
    if (__text) {
      list.push(__text)
      setList([...list])
      setText('')
    }
  }

  const onSpeak = (index: number) => {
    const _text = list[index];
    // ref.current.SpeechRecognition.speakStart('你是谁呢，能告诉我吗')
    ref.current.SpeechRecognition.speakStart(_text)
  }

  return (
    <div className="VoiceInput main t-FB1 t-FBV">
      <div className="voice-i-content t-FB1">
        {
          list.map((item, index) => {
            return (
              <div className="v-i-row" key={`${item.slice(0,6)}.${index}`}>
                <div className="v-i-row-content t-FBH">
                  <div className="v-i-row-img">
                    <img alt="wy617418875@gmail.com" src="https://cdn.auth0.com/avatars/wy.png"  />
                  </div>
                  <div className="v-i-row-text t-FB1">
                    {item}
                    <p className="">
                      <span className="speakBtn" onClick={() => {
                        onSpeak(index)
                      }}>speak</span>
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        }

      </div>
      <div className="voice-i-bottom">
        <div className="v-i-bottom-content">
          <Input id="VoiceInputEle" className="VoiceInputEle" placeholder="点击开始语音识别，请说出你想问的问题"
            value={text ? text + '...' : ''}
            onChange={e => {
              setText(e.target.value)
            }}
          />
          <div className="mt_10">
            <Button className="mr_10" type="primary" onClick={() => {
              onSend();
            }}>发送</Button>
            <Button className="mr_10" onClick={() => {
              start();
            }}>开始语音识别</Button>
            <Button className="mr_10" onClick={() => {
              end();
            }}>结束语音识别</Button>
          </div>
          <p className="info mt_10"><a href="https://console.cloud.google.com/getting-started?project=tonal-affinity-384107&hl=zh-cn&walkthrough_id=assistant_webhosting_index" target='_blank'>Google Cloud</a> Web  <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Speech_API#%E8%AF%AD%E9%9F%B3%E5%90%88%E6%88%90" target='_blank' className="">Speech API</a>  每日有次数限制，可能会因为次数受限而失败</p>
        </div>
      </div>
    </div>
  )
}

export default VoiceInput
