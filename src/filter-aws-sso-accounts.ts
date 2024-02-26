function runScript() {
  // @ts-ignore
  const ACCOUNT_IDS = ACCOUNT_IDS_REPLACE;
  // Find the portal-instance-list element
  let instanceListElement: HTMLElement = document.querySelector("portal-instance-list");
  // Find the portal-application element
  let applicationElement: HTMLElement = document.querySelector("portal-application");

  // Check if both elements were found
  if (applicationElement === null) {
    // If either portal-instance-list or portal-application is null,
    // retry after a short delay
    setTimeout(runScript, 100); // Retry after 100 milliseconds
    return;
  }
  // If both elements are found, proceed with the script
  // If portal-instance-list is null, find and click portal-application
  if (instanceListElement === null) {
    if (applicationElement) {
      applicationElement.click();
    } else {
      console.error("portal-application element not found.");
    }
  }

  // Now filter portal-instance-list based on the condition
  instanceListElement = document.querySelector("portal-instance-list");
  if (instanceListElement) {
    let childrenWithAccountId = Array.from(instanceListElement.children).filter((child) => {
      let accountIdSpan: HTMLElement = child.querySelector(".accountId");
      return accountIdSpan && ACCOUNT_IDS.includes(accountIdSpan.innerText);
    });

    // Now childrenWithAccountId contains the filtered children
    // Hide all children that are not in childrenWithAccountId
    Array.from(instanceListElement.children).forEach((child: HTMLElement) => {
      if (!childrenWithAccountId.includes(child)) {
        child.style.display = "none";
      }
    });
    // Click on all children that are in childrenWithAccountId
    childrenWithAccountId.forEach((child: HTMLElement) => {
      let instanceSection: HTMLElement = child.querySelector(".instance-section");
      instanceSection.click();
    });
  } else {
    console.error("portal-instance-list element not found.");
  }
}

// Start checking for both elements
runScript();
