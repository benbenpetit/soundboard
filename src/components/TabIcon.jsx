import React from 'react';
import HomeFull from 'assets/icons/HomeFull.icon';
import HomeOutline from 'assets/icons/HomeOutline.icon';
import SearchFull from 'assets/icons/SearchFull.icon';
import SearchOutline from 'assets/icons/SearchOutline.icon';
import LibraryFull from 'assets/icons/LibraryFull.icon';
import LibraryOutline from 'assets/icons/LibraryOutline.icon';

const TabIcon = ({ name }) => {
  return (
    <>
      {(() => {
        switch (name) {
          case 'home-full': return <HomeFull/>;
          case 'home-outline': return <HomeOutline/>;
          case 'search-full': return <SearchFull/>;
          case 'search-outline': return <SearchOutline/>
          case 'library-full': return <LibraryFull/>
          case 'library-outline': return <LibraryOutline/>
          default: return <HomeFull/>;
        }
      })()}
    </>
  )
}

export default TabIcon;
