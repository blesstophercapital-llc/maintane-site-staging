/* Maintane Septic Health Check
 * Runs the on-page quiz, gates the result behind lead capture, and then
 * renders the recommended next step after the lead form succeeds.
 */
(function () {
  'use strict';

  var HOSTNAME = (window.location.hostname || '').toLowerCase();
  var IS_STAGING = HOSTNAME === 'localhost' || HOSTNAME === '127.0.0.1' || HOSTNAME.indexOf('staging') !== -1;
  var form = document.querySelector('[data-health-check-form]');
  if (!form) return;

  var questions = Array.prototype.slice.call(form.querySelectorAll('[data-question]'));
  var progress = document.querySelector('[data-health-check-progress]');
  var progressBar = document.querySelector('[data-health-check-progress-bar]');
  var backButton = document.querySelector('[data-health-check-back]');
  var nextButton = document.querySelector('[data-health-check-next]');
  var startButton = document.querySelector('[data-health-check-start]');
  var gate = document.querySelector('[data-health-check-gate]');
  var leadForm = document.querySelector('[data-health-check-lead]');
  var resultPanel = document.querySelector('[data-health-check-result]');
  var resultBadge = document.querySelector('[data-result-badge]');
  var resultTitle = document.querySelector('[data-result-title]');
  var resultBody = document.querySelector('[data-result-body]');
  var resultPlan = document.querySelector('[data-result-plan]');
  var resultPrimary = document.querySelector('[data-result-primary]');
  var resultSecondary = document.querySelector('[data-result-secondary]');
  var currentIndex = 0;
  var currentClassification = null;

  var results = {
    routine: {
      badge: 'Routine mode',
      title: 'Your system looks ready for a simple monthly routine.',
      body: 'Based on your answers, you did not flag urgent symptoms. This is where monthly septic defense makes the most sense: stay consistent, keep harsh inputs low, and keep pump-outs and inspections on the calendar.',
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

  function selectedInput(question) {
    return question.querySelector('input[type="radio"]:checked');
  }

  function selectedFields() {
    var answers = {};
    var selected = form.querySelectorAll('input[type="radio"]:checked');
    for (var i = 0; i < selected.length; i++) {
      answers[selected[i].name] = selected[i];
    }
    return answers;
  }

  function showQuestion(index) {
    currentIndex = Math.max(0, Math.min(index, questions.length - 1));
    for (var i = 0; i < questions.length; i++) {
      questions[i].hidden = i !== currentIndex;
    }
    if (progress) progress.textContent = 'Question ' + (currentIndex + 1) + ' of ' + questions.length;
    if (progressBar) progressBar.style.width = (((currentIndex + 1) / questions.length) * 100) + '%';
    if (backButton) backButton.disabled = currentIndex === 0;
    if (nextButton) {
      nextButton.disabled = !selectedInput(questions[currentIndex]);
      nextButton.textContent = currentIndex === questions.length - 1 ? 'Get My Result' : 'Next';
    }
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

  function setLeadValue(name, value) {
    if (!leadForm) return;
    var field = leadForm.querySelector('[name="' + name + '"]');
    if (field) field.value = value;
  }

  function fillLeadFields(classification) {
    var result = results[classification.type];
    setLeadValue('quiz_result', result.badge);
    setLeadValue('quiz_score', String(classification.score));
    setLeadValue('quiz_red_flags', classification.redFlags.join('; '));
    setLeadValue('quiz_recommendation', result.recommendation);
    setLeadValue('quiz_answers', JSON.stringify(classification.answers));
  }

  function showGate() {
    var answers = selectedFields();
    if (Object.keys(answers).length < questions.length) return;
    currentClassification = classify(answers);
    fillLeadFields(currentClassification);
    form.hidden = true;
    if (gate) gate.hidden = false;
    if (resultPanel) resultPanel.hidden = true;
    track('health_check_completed_before_gate', {
      quiz_result_type: currentClassification.type,
      quiz_score: currentClassification.score,
      quiz_red_flags: currentClassification.redFlags.join('; ')
    });
    if (gate) gate.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderResult() {
    if (!currentClassification || !resultPanel) return;
    var result = results[currentClassification.type];
    resultPanel.hidden = false;
    resultPanel.setAttribute('data-result-type', currentClassification.type);
    if (resultBadge) resultBadge.textContent = result.badge;
    if (resultTitle) resultTitle.textContent = result.title;
    if (resultBody) resultBody.textContent = result.body;
    if (resultPrimary) {
      resultPrimary.textContent = result.primaryText;
      resultPrimary.href = result.primaryHref;
    }
    if (resultSecondary) {
      resultSecondary.textContent = result.secondaryText;
      resultSecondary.href = result.secondaryHref;
    }
    if (resultPlan) {
      resultPlan.innerHTML = '';
      for (var i = 0; i < result.plan.length; i++) {
        var li = document.createElement('li');
        li.textContent = result.plan[i];
        resultPlan.appendChild(li);
      }
    }
    track('health_check_result_view', {
      quiz_result: result.badge,
      quiz_score: currentClassification.score,
      quiz_red_flags: currentClassification.redFlags.join('; ')
    });
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (startButton) {
    startButton.addEventListener('click', function () {
      track('health_check_start', { button_location: 'hero' });
    });
  }

  form.addEventListener('change', function (event) {
    if (!event.target || event.target.type !== 'radio') return;
    if (nextButton) nextButton.disabled = false;
    track('health_check_answer', {
      question: event.target.name,
      answer: event.target.getAttribute('data-answer-label') || event.target.value,
      answer_score: Number(event.target.getAttribute('data-score') || 0),
      red_flag: event.target.getAttribute('data-red-flag') === 'true'
    });
  });

  if (backButton) {
    backButton.addEventListener('click', function () {
      showQuestion(currentIndex - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', function () {
      if (!selectedInput(questions[currentIndex])) return;
      if (currentIndex === questions.length - 1) showGate();
      else showQuestion(currentIndex + 1);
    });
  }

  if (leadForm) {
    leadForm.addEventListener('maintane:lead-success', function () {
      renderResult();
    });
  }

  showQuestion(0);
})();
