export function Users_OpenUserModal({ modalHost }) {
  modalHost.open({
    title: "User Profile",
    bodyTemplate: `
      <os-block data-os-block="PopupBody">
        <os-user-form data-test-id="popup-user-form" mode="edit"></os-user-form>
      </os-block>
    `,
    confirmText: "Close"
  });
}
