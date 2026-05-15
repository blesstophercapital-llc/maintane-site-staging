/* Maintane Septic System Health Check
 * Scores the quiz locally, shows a personalized next step, and stores
 * result metadata in the lead form before Klaviyo capture.
 */
(function () {
  'use strict';

  var HOSTNAME = (window.location.hostname || '').toLowerCase();
  var IS_STAGING = HOSTNAME === 'localhost' || HOSTNAME === '127.0.0.1' || HOSTNAME.indexOf('staging') !== -1;
  var form = document.querySelector('[data-health-check-form]');
  if (!form) return;

  var error = document.querySelector('[data-health-check-error]');
  var progress = document.querySelector('[data-health-check-progress]');
  var resultPanel = document.querySelector('[data-health-check-result]');
  var resultBadge = document.querySelector('[data-result-badge]');
  var resultTitle = document.querySelector('[data-result-title]');
  var resultBody = document.querySelector('[data-result-body]');
  var resultPlan = document.querySelector('[data-result-plan]');
  var resultPrimary = document.querySelector('[data-result-primary]');
  var resultSecondary = document.querySelector('[data-result-secondary]');
  var hiddenResult = document.querySelector('[name="quiz_result"]');
  var hiddenScore = document.querySelector('[name="quiz_score"]');
  var hiddenRedFlags = document.querySelector('[name="quiz_red_flags"]');
  var hiddenRecommendation = document.querySelector('[name="quiz_recommendation"]');
  var hiddenAnswers = document.querySelector('[name="quiz_answers"]');

  var results = {
    routine: {
      badge: 'Routine mode',
      title: 'Your system looks ready for a simple monthly routine.',
      body: 'Based on your answers, you did not flag urgent symptoms. That is exactly where monthly septic defense makes the most sense: stay consistent, keep harsh inputs low, and keep pump-outs and inspections on the calendar.',
      recommendation: 'Start monthly septic defense.',
      primaryText: 'Shop Maintane',
      primaryHref: 'https://getmaintane.com/shop.html',
      secondaryText: 'See dosing guide',
      secondaryHref: '/dosing-guide.html',
      plan: [
        'Use Maintane once a month as directed.',
        'Choose 6, 12, or 18 months of supply based on how far ahead you want to stay.',
        'Keep normal pump-outs and inspections scheduled.'
      ]
    },
    watch: {
      badge: 'Watch mode',
      title: 'Your answers show a few things worth tightening up.',
      body: 'This does not automatically mean you have a failing system. It means your home may benefit from cleaner habits, better monthly consistency, and closer attention to smells, slow drains, or heavy water-use days.',
      recommendation: 'Tighten habits and start a monthly routine if there are no active red flags.',
      primaryText: 'Take the next step',
      primaryHref: 'https://getmaintane.com/shop.html',
      secondaryText: 'Review warning signs',
      secondaryHref: '/septic-tank-full-signs.html',
      plan: [
        'Cut back on wipes, grease, chemical drain cleaners, and heavy single-day water loads.',
        'Watch whether odors, gurgling, or slow drains repeat.',
        'If symptoms are not active or severe, build a monthly septic defense routine.'
      ]
    },
    pro: {
      badge: 'Call-a-pro mode',
      title: 'Your answers include signs that deserve a septic professional.',
      body: 'Maintane is for routine monthly maintenance. Backup, alarms, wet or smelly drain fields, surfacing sewage, or persistent unresolved odor should not be treated like a normal product decision.',
      recommendation: 'Call a septic professional before treating this like routine maintenance.',
      primaryText: 'Review urgent warning signs',
      primaryHref: '/septic-backup.html',
      secondaryText: 'Shop after the system is stable',
      secondaryHref: 'https://getmaintane.com/shop.html',
      plan: [
        'Do not rely on any additive to fix an active failure.',
        'Reduce water use and keep kids and pets away from wet or sewage-smelling areas.',
        'Once the system is stable, use monthly maintenance between pump-outs and inspections.'
      ]
    }
  };

  function track(name, params) {
    params = params || {};
    params.source_page = window.location.pathname || '/';
    if (IS_STAGING) {
      console.log('[health-check] STAGING event', name, params);
      return;
    }
    if (typeof window.gtag === 'function') {
      try { window.gtag('event', name, params); } catch (e) {}
    }
  }

  function selectedFields() {
    var answers = {};
    var selected = form.querySelectorAll('input[type="radio"]:checked');
    for (var i = 0; i < selected.length; i++) {
      answers[selected[i].name] = selected[i];
    }
    return answers;
  }

  function updateProgress() {
    var total = form.querySelectorAll('fieldset[data-question]').length;
    var answered = Object.keys(selectedFields()).length;
    if (progress) progress.textContent = answered + ' of ' + total + ' answered';
    if (error && answered === total) error.hidden = true;
  }

  function classify(answers) {
    var score = 0;
    var redFlags = [];
    var serialized = {};
    var keys = Object.keys(answers);
    for (var i = 0; i < keys.length; i++) {
      var field = answers[keys[i]];
      var points = Number(field.getAttribute('data-score') || 0);
      var label = field.getAttribute('data-answer-label') || field.value;
      score += points;
      serialized[keys[i]] = label;
      if (field.getAttribute('data-red-flag') === 'true') redFlags.push(label);
    }
    var type = 'routine';
    if (redFlags.length || score >= 10) type = 'pro';
    else if (score >= 5) type = 'watch';
    return {
      type: type,
      score: score,
      redFlags: redFlags,
      answers: serialized
    };
  }

  function renderResult(classification) {
    var result = results[classification.type];
    if (!result || !resultPanel) return;

    resultPanel.hidden = false;
    resultPanel.setAttribute('data-result-type', classification.type);
    if (resultBadge) resultBadge.textContent = result.badge;
    if (resultTitle) resultTitle.textContent = result.title;
    if (resultBody) resultBody.textContent = result.body;
    if (resultPrimary) {
      resultPrimary.textContent = result.primaryText;
      resultPrimary.href = result.primaryHref;
      resultPrimary.setAttribute('data-event-label', classification.type + '_primary');
    }
    if (resultSecondary) {
      resultSecondary.textContent = result.secondaryText;
      resultSecondary.href = result.secondaryHref;
      resultSecondary.setAttribute('data-event-label', classification.type + '_secondary');
    }
    if (resultPlan) {
      resultPlan.innerHTML = '';
      for (var i = 0; i < result.plan.length; i++) {
        var li = document.createElement('li');
        li.textContent = result.plan[i];
        resultPlan.appendChild(li);
      }
    }
    if (hiddenResult) hiddenResult.value = result.badge;
    if (hiddenScore) hiddenScore.value = String(classification.score);
    if (hiddenRedFlags) hiddenRedFlags.value = classification.redFlags.join('; ');
    if (hiddenRecommendation) hiddenRecommendation.value = result.recommendation;
    if (hiddenAnswers) hiddenAnswers.value = JSON.stringify(classification.answers);

    track('health_check_result_view', {
      quiz_result: result.badge,
      quiz_score: classification.score,
      quiz_red_flags: classification.redFlags.join('; ')
    });
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  form.addEventListener('change', function (event) {
    if (!event.target || event.target.type !== 'radio') return;
    updateProgress();
    track('health_check_answer', {
      question: event.target.name,
      answer: event.target.getAttribute('data-answer-label') || event.target.value,
      answer_score: Number(event.target.getAttribute('data-score') || 0),
      red_flag: event.target.getAttribute('data-red-flag') === 'true'
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var total = form.querySelectorAll('fieldset[data-question]').length;
    var answers = selectedFields();
    if (Object.keys(answers).length < total) {
      if (error) error.hidden = false;
      updateProgress();
      return;
    }
    if (error) error.hidden = true;
    renderResult(classify(answers));
  });

  var startButtons = document.querySelectorAll('[data-health-check-start]');
  for (var i = 0; i < startButtons.length; i++) {
    startButtons[i].addEventListener('click', function () {
      track('health_check_start', { button_location: 'hero' });
    });
  }

  updateProgress();
})();
