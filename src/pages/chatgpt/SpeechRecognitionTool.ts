/* eslint-disable no-restricted-globals */
// @ts-nocheck
import { getVoiceCommandByTranscript } from './util'
type PropsType = {
  lang?: string, // 'zh-CN'
  onTextChange: (text:string)=> void, // 语音转文字 文字变更时的回调
  onSend: () => void, // 发送指令
}
class SpeechRecognitionTool {
  // 语音识别对象
  private speechRecognition = null;

  public speechRecognitionOpt = {
    lang: 'zh-CN', // 'zh-CN' | 'cmn-Hant-TW'; 
    isStarted: false, // 是否开始录音
    textAreaElement: undefined, // 主要的文字输入框
    Parts: [], // 用来记忆文字输入框的语音输入過程中的暫存文字
    submitButtonElement: undefined, // 主要的送出按鈕

    onTextChange: () => { }, // 语音转文字 文字变更时的回调
    onSend: ()=>{}, // 发送指令
  }

  constructor(opt: PropsType) {

    this.speechRecognitionOpt.lang = opt.lang || 'zh-CN';
    this.speechRecognitionOpt.onTextChange = opt.onTextChange;
    this.speechRecognitionOpt.onSend = opt.onSend;
    this.speechRecognitionInit();
    
  }
  /** 语音识别 初始化 */
  private speechRecognitionInit() {
    const SpeechRecognitionFN = window.SpeechRecognition || window.webkitSpeechRecognition
    const _speechRecognition = new SpeechRecognitionFN()
    _speechRecognition.continuous = true;
    _speechRecognition.interimResults = true
    _speechRecognition.lang = this.speechRecognitionOpt.lang; //  | 'cmn-Hant-TW';  // lang

    // this.speechRecognitionOpt.isStarted = false
    // this.speechRecognitionOpt.textAreaElement = document.getElementById('VoiceInputEle');

    _speechRecognition.onstart = (event) => {
      console.log('开始进行 SpeechRecognition 语音辨识');
    };
    _speechRecognition.onerror = (event) => {
      console.log('SpeechRecognition 语音辨识錯誤(error)或中斷(abort)!', event);
    }
    _speechRecognition.onend = (event) => {
      // 如果目前瀏覽器頁籤抓不到麥克風資源 (例如有兩个 Tab 都想要麥克風)，那麼就会一直不斷的停止语音辨识！
      console.log('停止 SpeechRecognition 语音辨识!', event);
      // speechRecognitionStop$.next();
    };
    _speechRecognition.onresult = async (event) => {
      console.log('speechRecognition.onresult', event)
      await this.processSpeechRecognitionResult(event);
    }

    this.speechRecognition = _speechRecognition
    // 开始语音识别
    this.start();
  }

  /** 语音识别开始 */
  public start(): void {
    if (!this.speechRecognitionOpt.isStarted) {
      this.speechRecognitionOpt.isStarted = true
      this.speechRecognitionOpt.Parts = [];
      this.speechRecognition.start()
    }
  }

  /** 语音识别 停止 */
  public end(): void {
    if (this.speechRecognitionOpt.isStarted) {
      this.speechRecognitionOpt.isStarted = false
      this.speechRecognition.stop()
    }
  }

  private processSpeechRecognitionResult = async (event) => {
    console.log('语音识別事件: ', event);

    let results = event.results[event.resultIndex];

    console.log('results.length', results.length);

    let transcript = results[0].transcript; // 理论上只会有一个結果

    console.log('语音输入: ' + transcript, 'isFinal: ', results.isFinal, 'Parts: ', this.speechRecognitionOpt.Parts);

    if (this.speechRecognitionOpt.Parts.length === 0) {
      this.speechRecognitionOpt.Parts[0] = transcript;
    } else {
      this.speechRecognitionOpt.Parts[this.speechRecognitionOpt.Parts.length - 1] = transcript;
    }

    // 展示文案 start
    const textResult = this.speechRecognitionOpt.Parts.join(''); // 用来展示的文字

    if (this.speechRecognitionOpt.onTextChange) {
      this.speechRecognitionOpt.onTextChange(textResult);
    }

    // 如果绑定了输入框 直接展示在输入框内
    if (this.speechRecognitionOpt.textAreaElement) {
      // 显示
      this.speechRecognitionOpt.textAreaElement.value = textResult + '…';
      this.speechRecognitionOpt.textAreaElement.dispatchEvent(new Event('input', {
        bubbles: true
      }));
      this.speechRecognitionOpt.textAreaElement.focus();
      this.speechRecognitionOpt.textAreaElement.setSelectionRange(this.speechRecognitionOpttextAreaElement.value.length, this.textAreaElement.value.length);
      this.speechRecognitionOpt.textAreaElement.scrollTop = this.speechRecognitionOpt.textAreaElement.scrollHeight; // 自動捲動到最下方
    }

    // 展示文案 end
    
    if (results.isFinal) {
      console.log('Final Result: ', results);
      // 获取指令
      let id = getVoiceCommandByTranscript(this.speechRecognitionOpt.Parts[this.speechRecognitionOpt.Parts.length - 1]);
      console.log('id = ', id);

      switch (id) {
        case 'enter':
          this.speechRecognitionOpt.Parts.pop();
          if (this.speechRecognitionOpt.Parts.length > 0) {
            const _str = this.speechRecognitionOpt.Parts.join('');
            this.speechRecognitionOpt.onSend?.(_str);

            if (this.speechRecognitionOpt.textAreaElement) {
              textAreaElement.value = _str;
              textAreaElement.dispatchEvent(new Event('input', {
                bubbles: true
              }));
              textAreaElement.focus();
              textAreaElement.setSelectionRange(textAreaElement.value.length, textAreaElement.value.length);
              textAreaElement.scrollTop = textAreaElement.scrollHeight; // 自動捲動到最下方
            }
            this.speechRecognitionOpt.Parts = [];
            // speechRecognitionStop$.next();
          }
          break;

        case 'clear':
          this.speechRecognitionOpt.Parts = [];
          break;

        case 'reload':
          location.reload();
          break;

        case 'delete':
          this.speechRecognitionOpt.Parts.pop();
          this.speechRecognitionOpt.Parts.pop();
          break;

        case '換行':
          this.speechRecognitionOpt.Parts[this.speechRecognitionOpt.Parts.length - 1] = '\r\n';
          break;

        case '重置':
          reset();
          break;

        case '切换至中文模式':
          console.log('切换至中文模式');
          microphoneButtonElement.changeLanguage('zh-CN');
          this.speechRecognitionOpt.Parts[this.speechRecognitionOpt.Parts.length - 1] = '';
          break;

        case '切换至英文模式':
          console.log('切换至英文模式');
          microphoneButtonElement.changeLanguage('en-US');
          this.speechRecognitionOpt.Parts[this.speechRecognitionOpt.Parts.length - 1] = '';
          break;

        case '关闭语音识别':
          console.log('关闭语音识别');
          speechRecognitionStop$.next();
          break;

        case 'paste':
          this.speechRecognitionOpt.Parts.pop();
          console.log('贴上剪贴簿');

          this.speechRecognitionOpt.Parts = [...this.speechRecognitionOpt.Parts, '\r\n\r\n'];
          this.speechRecognitionOpt.Parts = [...this.speechRecognitionOpt.Parts, await window.navigator.clipboard.readText()];
          this.speechRecognitionOpt.Parts = [...this.speechRecognitionOpt.Parts, '\r\n\r\n'];
          break;

        default:
          this.speechRecognitionOpt.Parts[this.speechRecognitionOpt.Parts.length - 1] = this.speechRecognitionOpt.Parts[this.speechRecognitionOpt.Parts.length - 1].replace(/…$/g, '');
          console.log('确认输入', this.speechRecognitionOpt.Parts);
          break;
      }

      this.speechRecognitionOpt.Parts = [...this.speechRecognitionOpt.Parts, ''];

      if (this.speechRecognitionOpt.textAreaElement) {
        this.speechRecognitionOpt.textAreaElement.value = this.speechRecognitionOpt.Parts.join('');
        this.speechRecognitionOpt.textAreaElement.dispatchEvent(new Event('input', {
          bubbles: true
        }));
        this.speechRecognitionOpt.textAreaElement.focus();
        this.speechRecognitionOpt.textAreaElement.setSelectionRange(this.speechRecognitionOpt.textAreaElement.value.length, this.speechRecognitionOpt.textAreaElement.value.length);
        this.speechRecognitionOpt.textAreaElement.scrollTop = this.speechRecognitionOpt.textAreaElement.scrollHeight; // 自動捲動到最下方
      }
      
    }
  }

  public speakStart = (text: string) => {
    let currentVoice = speechSynthesis.getVoices().filter(x => x.voiceURI.includes('普通话')).pop();
    // window.speechSynthesis.onvoiceschanged = function () {
    //   currentVoice = speechSynthesis.getVoices().filter(x => x.lang === 'zh-TW').pop();
    // };

    // console.log(`准备合成阅读文章语言: ${text}`, currentVoice);

    let utterance = new SpeechSynthesisUtterance(text);
    if (currentVoice) {
      utterance.voice = currentVoice;
      // 語速
      if (currentVoice.lang === 'zh-CN') { //  'zh-TW'
        utterance.rate = 1.3; // 0.1 ~ 10, default: 1
      } else {
        utterance.rate = 1.0; // 0.1 ~ 10, default: 1
      }
    }

    utterance.onstart = (evt) => {
      console.log('开始发言', evt);
    }

    utterance.onend = (evt) => {
      console.log('结束发言', evt);
    }

    utterance.onerror = (evt) => {
      console.log('发音过程失败', evt);
    }

    speechSynthesis.speak(utterance);
  }

  public speakStop = () => {
    console.log('speechSynthesisStop');

    navigator.getUserMedia({
        audio: true
      },
      (audioStream) => {
        // Microphone is usable.
        audioStream.getTracks().forEach(function (track) {
          track.stop();
        });
      },
      (error) => {
        console.error("Microphone is not usable: " + error);
      }
    );

    if (speechSynthesis.speaking) {
      console.log('正在播放合成语音中，取消本次播放！');
      speechSynthesis.cancel();
    }
  }
}

export default SpeechRecognitionTool
