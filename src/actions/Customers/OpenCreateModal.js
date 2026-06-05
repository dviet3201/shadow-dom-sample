export function Customers_OpenCreateModal({ modalHost }) {
  modalHost.open({
    title: "Create Customer",
    bodyTemplate: `
      <os-block data-os-block="PopupBody">
        <os-customer-form data-test-id="popup-customer-form" mode="create"></os-customer-form>
      </os-block>
    `,
    confirmText: "Close"
  });
}
