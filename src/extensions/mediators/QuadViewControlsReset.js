export default function QuadViewControlsReset(camControls, camParams) {
  camParams.onResetControls((offset) => {
    camControls.resetControls(offset);
  });
}
