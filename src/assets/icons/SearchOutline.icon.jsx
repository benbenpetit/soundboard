import React from 'react';
import Svg, { Path } from 'react-native-svg';

const SearchOutline = () => {
  return (
    <Svg
      width={22}
      height={23}
      fill="none"
    >
      <Path
        fill="#bdbdbd"
        d="M9.677.606C4.348.606 0 4.864 0 10.15c0 5.286 4.347 9.545 9.677 9.545a9.724 9.724 0 0 0 6.077-2.117l4.477 4.478a1.028 1.028 0 1 0 1.455-1.454l-4.469-4.47a9.42 9.42 0 0 0 2.137-5.982c0-5.288-4.347-9.546-9.677-9.546zm-7.62 9.545c0-4.121 3.397-7.489 7.62-7.489 4.223 0 7.62 3.368 7.62 7.489 0 4.12-3.397 7.488-7.62 7.488-4.223 0-7.62-3.367-7.62-7.49v.002z"
      />
    </Svg>
  )
}

export default SearchOutline;
