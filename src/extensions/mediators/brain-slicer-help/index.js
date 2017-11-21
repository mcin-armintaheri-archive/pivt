import BrainSlicerHelpWindowContent from './BrainSlicerHelpWindowContent';

export default class BrainSlicerHelp {
  constructor(helpWindow) {
    helpWindow.setHelpMessageComponent(BrainSlicerHelpWindowContent);
    helpWindow.setHelpTitle('Brain Slicer Help');
  }
}
