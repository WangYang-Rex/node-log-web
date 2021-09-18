import Loadable from 'react-loadable';
// const { Loadable } = require('react-loadable');
import { Spin } from 'antd';
import React, { Component } from 'react';

export const Loading = (props:any) => {
  if (props.error) {
    // props.retry&&props.retry();
    window.location.reload();
    console.log(props.error)
    return <div >加载失败</div>
  } else if (props.timedOut) {
    // props.retry&&props.retry();
    window.location.reload();
    return <div >加载超时</div>
  } else if (props.pastDelay) {
    return <Spin />
  }
  return null
};


export const importPath = ({loader}:any) => {
  return Loadable({
    loader,
    loading:Loading,
    delay: 200,
    timeout: 30000,
  })
}
