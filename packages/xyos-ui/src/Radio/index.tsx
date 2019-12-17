
import './lib/radio.less'


// export { default as Radio } from './lib/Radio'
// export { default as RadioGroup } from './lib/RadioGroup'

import Radio from './lib/Radio';
import Group from './lib/RadioGroup';


Radio.Group = Group;
export {  Group };
export default Radio;