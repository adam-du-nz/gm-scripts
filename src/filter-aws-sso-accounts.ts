function runScript() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const ACCOUNT_IDS = ACCOUNT_IDS_REPLACE as string[];
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        const allAccounts: NodeListOf<HTMLElement> | [] = document.querySelectorAll(
          'button[data-testid="account-list-cell"]',
        );
        if (allAccounts.length > 0) {
          observer.disconnect();
          hideAndClickAccounts(allAccounts, ACCOUNT_IDS);
        }
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function hideAndClickAccounts(allAccounts: NodeListOf<HTMLElement>, ACCOUNT_IDS: string[]) {
  const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  Array.from(allAccounts).forEach((account: HTMLElement) => {
    if (!ACCOUNT_IDS.some((accountId) => account.innerText.trim().includes(accountId))) {
      // This block will only execute if NONE of the ACCOUNT_IDS elements are found in account. console.log("hidden buttons");
      account.style.display = "none";
    } else {
      account.dispatchEvent(event);
    }
  });
}

runScript();
