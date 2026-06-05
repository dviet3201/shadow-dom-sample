export function Orders_OpenCreateModal({ modalHost }) {
  modalHost.open({
    title: "Create Order",
    bodyTemplate: `
      <os-block data-os-block="PopupBody">
        <os-order-form data-test-id="popup-order-form" mode="create"></os-order-form>
      </os-block>
    `,
    confirmText: "Close"
  });
}
