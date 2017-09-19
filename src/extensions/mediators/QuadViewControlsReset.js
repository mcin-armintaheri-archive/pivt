export default function QuadViewControlsReset(camControls, camParams) {
  camParams.onResetControls(() => {
    camControls.getTrackballControls().resetControls();
  });
}
