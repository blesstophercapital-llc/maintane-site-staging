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
  var proHelpPanel = document.querySelector('[data-pro-help-panel]');
  var proHelpForm = document.querySelector('[data-pro-help-form]');
  var currentIndex = 0;
  var currentClassification = null;

  var results = {
    routine: {
      resultKey: 'just_in_time',
      badge: 'Just In Time',
      identityKey: 'responsible_septic_owner',
      identity: 'The Responsible Septic Owner',
      title: "GOOD NEWS: YOU'RE A RESPONSIBLE SEPTIC OWNER",
      body: "BAD NEWS: YOU'RE NOT CURRENTLY PROTECTED",
      recommendation: 'Start monthly septic defense.',
      primaryText: 'Start Monthly Septic Defense',
      primaryHref: 'https://getmaintane.com/shop.html',
      secondaryText: 'See dosing guide',
      secondaryHref: '/dosing-guide.html',
      plan: [
        'Start a monthly septic care routine before warning signs show up.',
        'Keep pump-outs and inspections on their normal schedule.',
        'Use Maintane once a month as directed to support the biology your tank depends on.'
      ]
    },
    watch: {
      resultKey: 'almost_too_late',
      badge: 'Almost Too Late',
      identityKey: 'early_warning_catcher',
      identity: 'The Early Warning Catcher',
      title: 'GOOD NEWS: YOU CAUGHT THE WARNING SIGNS EARLY',
      body: 'BAD NEWS: YOUR SEPTIC SYSTEM IS ALREADY ASKING FOR HELP',
      recommendation: 'Tighten habits and start a monthly routine if there are no active red flags.',
      primaryText: 'Get Ahead With Monthly Septic Defense',
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
      resultKey: 'too_late_to_maintane',
      badge: 'Too Late To Maintane',
      identityKey: 'smart_escalator',
      identity: 'The Smart Escalator',
      title: 'GOOD NEWS: YOU KNOW THIS IS NOT NORMAL',
      body: 'BAD NEWS: THIS IS TOO LATE TO MAINTANE RIGHT NOW',
      recommendation: 'Call a septic professional or schedule pump-out before treating this like routine maintenance.',
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
    else if (score > 0) type = 'watch';
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
    setLeadValue('septic_health_result_key', result.resultKey);
    setLeadValue('septic_health_result', result.badge);
    setLeadValue('septic_health_identity_key', result.identityKey);
    setLeadValue('septic_health_identity', result.identity);
    setLeadValue('septic_health_score', String(classification.score));
    setLeadValue('septic_health_red_flags', classification.redFlags.join('; '));
    setLeadValue('septic_health_recommendation', result.recommendation);
    setLeadValue('septic_health_answers', JSON.stringify(classification.answers));
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
      septic_health_result_key: results[currentClassification.type].resultKey,
      septic_health_result: results[currentClassification.type].badge,
      septic_health_identity: results[currentClassification.type].identity,
      septic_health_score: currentClassification.score,
      septic_health_red_flags: currentClassification.redFlags.join('; ')
    });
    if (gate) gate.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderResult() {
    if (!currentClassification || !resultPanel) return;
    var result = results[currentClassification.type];
    resultPanel.hidden = false;
    resultPanel.setAttribute('data-result-type', currentClassification.type);
    if (resultBadge) resultBadge.textContent = result.badge;
    renderAnnouncement(resultTitle, result.title, 'good');
    renderAnnouncement(resultBody, result.body, 'bad');
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
    if (proHelpPanel) {
      proHelpPanel.hidden = currentClassification.type !== 'pro';
    }
    if (currentClassification.type === 'pro') populateProHelpForm();
    track('health_check_result_view', {
      septic_health_result_key: result.resultKey,
      septic_health_result: result.badge,
      septic_health_identity: result.identity,
      septic_health_score: currentClassification.score,
      septic_health_red_flags: currentClassification.redFlags.join('; ')
    });
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderAnnouncement(element, text, tone) {
    if (!element) return;
    element.innerHTML = '';
    var label = tone === 'good' ? 'GOOD NEWS:' : 'BAD NEWS:';
    if (text.indexOf(label) !== 0) {
      element.textContent = text;
      return;
    }
    var labelSpan = document.createElement('span');
    labelSpan.className = 'health-result-announcement-label health-result-announcement-label-' + tone;
    labelSpan.textContent = label;
    element.appendChild(labelSpan);
    element.appendChild(document.createTextNode(text.slice(label.length)));
  }

  function leadValue(name) {
    if (!leadForm) return '';
    var field = leadForm.querySelector('[name="' + name + '"]');
    return field ? field.value : '';
  }

  function setProHelpValue(name, value) {
    if (!proHelpForm) return;
    var field = proHelpForm.querySelector('[name="' + name + '"]');
    if (field) field.value = value;
  }

  function populateProHelpForm() {
    setProHelpValue('email', leadValue('email'));
    setProHelpValue('first_name', leadValue('first_name'));
    setProHelpValue('last_name', leadValue('last_name'));
    setProHelpValue('septic_health_result_key', 'too_late_to_maintane');
    setProHelpValue('septic_health_result', 'Too Late To Maintane');
    setProHelpValue('pro_help_requested', 'yes');
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
