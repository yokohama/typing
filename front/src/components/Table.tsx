"use client"

import React, { ReactNode } from 'react';

export const Table = ({
  children,
} : {
  children: ReactNode
}) => {
  return(
    <div className="overflow-x-auto my-6 p-4">
      <div 
        className="
          border-4 border-yellow-300 
          rounded-xl overflow-hidden
      ">
        <table className="
          min-w-full bg-white
          border-collapse
        ">
          {children}
        </table>
      </div>
    </div>
  );
};

export const Thead = ({
  children,
} : {
  children?: ReactNode,
}) => {
  return (
    <tbody>{children}</tbody>
  );
};

export const TheadTr = ({
  children,
} : {
  children?: ReactNode,
}) => {
  return (
    <tr 
      className="
        text-sm
        bg-yellow-200 
        text-gray-600
        leading-normal
    ">{children}</tr>
  );
};

export const Tbody = ({
  children,
} : {
  children?: ReactNode,
}) => {
  return (
    <tbody className="text-gray-700">{children}</tbody>
  );
};

export const TbodyTr = ({
  children,
  handleOnClick,
} : {
  children?: ReactNode,
  handleOnClick?: () => void,
}) => {
  return (
    <tr 
      onClick={handleOnClick}
      className="
        text-center
        border-b border-gray-200 
        hover:bg-red-100
    ">{children}</tr>
  );
};

export const Th = ({
  children,
} : {
  children?: ReactNode
}) => {
  return (
    <th className="
      py-3 px-6 
      font-bold
    ">{children}</th>
  );
}

export const Td = ({
  children,
} : {
  children?: ReactNode
}) => {
  return (
    <td className="py-3 px-6">{children}</td>
  );
}
