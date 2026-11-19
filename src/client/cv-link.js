// "Ver CV" goes through cv.andersein.com (services/cv-gate), which tells me when
// someone opens the CV. This adds where the visitor came from (LinkedIn, Google…),
// just the host, so the notification says it.

function tagCvLinks() {
  let from = '';
  try {
    const ref = document.referrer ? new URL(document.referrer).hostname : '';
    if (ref && ref !== location.hostname) from = ref;
  } catch (error) {
    from = '';
  }
  for (const link of document.querySelectorAll('a[data-cv]')) {
    const url = new URL(link.href);
    if (from) url.searchParams.set('from', from);
    link.href = url.toString();
  }
}

tagCvLinks();
