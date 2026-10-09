const form = document.querySelector('#lead-form');
const result = document.querySelector('#result');
const placeholder = document.querySelector('.result-placeholder');

function scoreLead(data) {
  const points = { need: /autom(at|ation)|workflow|agent|support|crm|process/i.test(data.need) ? 35 : 10, timeline: data.timeline === 'soon' ? 30 : data.timeline === 'later' ? 18 : 5,
    budget: data.budget === 'high' ? 25 : data.budget === 'mid' ? 18 : data.budget === 'low' ? 8 : 0,
    decision: data.decision_maker ? 10 : 0 };
  const total = points.need + points.timeline + points.budget + points.decision;
  const reasons = [
    'Business need matches an automation use case (+35)',
    `${data.timeline === 'soon' ? 'Near-term' : data.timeline === 'later' ? 'Mid-term' : 'Research'} timeline (+${points.timeline})`,
    `Budget band: ${data.budget} (+${points.budget})`,
    `Decision-maker: ${data.decision_maker ? 'yes' : 'not confirmed'} (+${points.decision})`
  ];
  return { total, reasons, qualified: total >= 70 };
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  data.decision_maker = form.elements.decision_maker.checked;
  const outcome = scoreLead(data);
  placeholder.hidden = true;
  result.hidden = false;
  result.innerHTML = `<p class="eyebrow">SYNTHETIC DEMO RESULT</p><h3>${outcome.qualified ? 'Qualified lead · awaiting approval' : 'Needs review before qualification'}</h3><div class="score"><b>${outcome.total}</b><span class="badge ${outcome.qualified ? '' : 'review'}">${outcome.qualified ? 'PENDING HUMAN REVIEW' : 'BELOW QUALIFICATION THRESHOLD'}</span></div><p><b>${escapeText(data.name)} · ${escapeText(data.company)}</b><br>${escapeText(data.email)}</p><h4>Score explanation</h4><ul class="reasons">${outcome.reasons.map((reason) => `<li>${escapeText(reason)}</li>`).join('')}</ul>${outcome.qualified ? '<div class="approval"><p><b>Human approval required</b></p><p class="approval-note">This local simulation does not write to HubSpot or contact the lead.</p><div class="approval-actions"><button type="button" data-review="approve">Approve handoff</button><button type="button" data-review="reject">Reject</button></div></div>' : '<p class="approval-note">No CRM action is taken in this synthetic demo.</p>'}`;
});

result.addEventListener('click', (event) => {
  const action = event.target.closest('[data-review]');
  if (!action) return;
  const approved = action.dataset.review === 'approve';
  const heading = result.querySelector('h3');
  heading.textContent = approved ? 'Approved · ready for CRM handoff' : 'Rejected · no CRM handoff';
  result.querySelector('.badge').textContent = approved ? 'APPROVED BY REVIEWER' : 'REJECTED BY REVIEWER';
  result.querySelector('.approval').innerHTML = `<p class="approval-note">${approved ? 'Reviewer approved this synthetic lead. In a connected workflow, this is where an authorized CRM handoff could occur.' : 'Reviewer rejected this synthetic lead. No CRM action was taken.'}</p>`;
});

function escapeText(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
