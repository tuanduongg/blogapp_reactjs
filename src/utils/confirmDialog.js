import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default function showConfirm({
  title = 'Thông báo',
  yesLabel,
  noLabel,
  message,
  yesAction = () => {},
  noAction = () => {},
  closeOnClickOutside = false
}) {
  const arrButon = [];
  if(yesLabel) {
    arrButon.push({
      label: yesLabel,
      onClick: yesAction,
    });
  }
  if(noLabel) {
    arrButon.push({
      label: noLabel,
      onClick: noAction,
    });
  }
  return confirmAlert({
    title,
    message,
    buttons: arrButon,
    closeOnEscape: false,
    closeOnClickOutside,
  });
}
