/** 语音识别指令 */
export const getVoiceCommandByTranscript = (str: string) => {

  const voice_commands:any = {
    enter: {
      terms: [
        'enter',
        'Run',
        'go',
        // 簡體字
        '回车',
        '发送',
        // 繁體字
        '送出',
        '去吧',
      ],
      match: 'exact' // prefix, exact, postfix
    },
    clear: {
      terms: [
        'clear',
        '重新輸入',
        '清除',
        '清空',
        '淨空'
      ],
      match: 'exact' // prefix, exact, postfix
    },
    delete: {
      terms: [
        'delete',
        // 繁體字
        '刪除',
        '刪除上一句',
        // 簡體字
        '删除'
      ],
      match: 'exact' // prefix, exact, postfix
    },
    reload: {
      terms: [
        'reload',
        '重新整理',
        '重载頁面',
      ],
      match: 'exact' // prefix, exact, postfix
    },
    逗号: {
      terms: [
        'comma',
        '逗号'
      ],
      match: 'exact' // prefix, exact, postfix
    },
    句号: {
      terms: [
        'period',
        '句号',
      ],
      match: 'exact' // prefix, exact, postfix
    },
    问号: {
      terms: [
        'questionmark',
        '问号'
      ],
      match: 'exact' // prefix, exact, postfix
    },
    换行: {
      terms: [
        'newline',
        '换行',
      ],
      match: 'exact' // prefix, exact, postfix
    },
    重置: {
      terms: [
        'reset',
        '重置',
        '重新開始',
        'リセット', // Risetto
        '초기화' // chogihwa
      ],
      match: 'exact' // prefix, exact, postfix
    },
    切换至中文模式: {
      terms: [
        '切换至中文模式',
        '切换到中文模式',
        '切换至中文',
        '切换到中文',
        '切换至中语模式',
        '切换到中语模式',
        '切换至中语',
        '切换到中语',
        'switch to Chinese mode'
      ],
      match: 'exact' // prefix, exact, postfix
    },
    切换至英文模式: {
      terms: [
        '切换至英文模式',
        '切换到英文模式',
        '切换至英文',
        '切换到英文',
        '切换至英语模式',
        '切换到英语模式',
        '切换至英语',
        '切换到英语',
        'switch to English mode'
      ],
      match: 'exact' // prefix, exact, postfix
    },
    关闭语音识别: {
      terms: [
        '关闭语音识别',
        '关闭语音'
      ],
      match: 'exact' // prefix, exact, postfix
    },
    // paste: {
    //   terms: [
    //     'paste',
    //     '貼上',
    //     '貼上剪貼簿'
    //   ],
    //   match: 'exact' // prefix, exact, postfix
    // },
    // explain_code: {
    //   terms: [
    //     '請說明以下程式碼',
    //     '請說明一下程式碼',
    //     '說明一下程式碼',
    //     '說明以下程式碼'
    //   ],
    //   match: 'exact' // prefix, exact, postfix
    // },
  };

  str = str.trim();
  if (navigator.userAgent.indexOf('Edg/') >= 0 && str.substr(str.length - 1, 1) === '。') {
    str = str.slice(0, -1);
  }

  for (const commandId in voice_commands) {
    if (Object.hasOwnProperty.call(voice_commands, commandId)) {
      const cmd = voice_commands[commandId];
      for (const term of cmd.terms) {
        let regex = new RegExp('^' + term + '$', "i");
        if (cmd.match === 'prefix') {
          regex = new RegExp('^' + term, "i");
        }
        if (cmd.match === 'postfix') {
          regex = new RegExp(term + '$', "i");
        }

        // console.log('term = ', term, ', str = ', str, ', match = ', cmd.match, ', UA = ', navigator.userAgent);
        if (str.search(regex) !== -1) {
          return commandId;
        }
      }
    }
  }
  return ''
}