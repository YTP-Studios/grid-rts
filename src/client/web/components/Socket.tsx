import * as React from 'react';
import * as io from 'socket.io-client';

let socket;
export const withSocket = <P, S>(Component: React.ComponentClass<P, S>) => {
  if (!socket) socket = io();
  return (props) => (<Component socket={socket} {...props} />);
}
