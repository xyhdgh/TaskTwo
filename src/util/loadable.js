import React from 'react';
// import Loadable from 'react-loadable';

/**
 * 默认过场动画
 */
const DefaultLoading = () => {
  return (
    <div>
      Loading...
    </div>
  )
}

export default (loader, loading = DefaultLoading) => {
  return Loadable({ loader, loading })
}