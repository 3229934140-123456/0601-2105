(function () {
  'use strict';

  var STORAGE_KEYS = {
    TASKS: 'yt_driver_tasks_v2',
    EXPENSES: 'yt_driver_expenses_v2',
    CHECKINS: 'yt_driver_checkins_v2',
    PHOTOS: 'yt_driver_photos_v2',
    EXCEPTIONS: 'yt_driver_exceptions_v2',
    CURRENT_TASK: 'yt_driver_current_task_v2',
    MESSAGES: 'yt_driver_messages_v2'
  };

  var STEP_META = [
    { name: '装货打卡', icon: '🏭', timeLabel: 'startTime', planLabel: '装货计划时间' },
    { name: '在途休息打卡', icon: '☕', timeLabel: 'startTime', planLabel: '预计休息时间' },
    { name: '卸货打卡', icon: '🏢', timeLabel: 'endTime', planLabel: '卸货计划时间' }
  ];

  var PHOTO_TYPES = {
    weight: { label: '磅单', icon: '⚖️' },
    seal: { label: '封签', icon: '🔒' },
    damage: { label: '货损', icon: '📦' },
    sign: { label: '签收', icon: '✍️' }
  };

  var defaultTasks = [
    {
      id: 'T20260609001',
      status: 'pending',
      startAddr: '上海市浦东新区张江高科技园区博云路2号',
      endAddr: '杭州市余杭区未来科技城文一西路1218号',
      startTime: '2026-06-09 14:00',
      endTime: '2026-06-10 08:00',
      cargoName: '电子产品',
      cargoWeight: '12.5吨',
      cargoVolume: '28立方米',
      cargoType: '普通货物',
      requirements: ['需防雨', '轻拿轻放', '禁止混装'],
      vehicleType: '9.6米厢式货车',
      price: 3800,
      distance: 195,
      contacts: [
        { name: '王经理', role: '发货人', phone: '13800138001' },
        { name: '李主管', role: '收货人', phone: '13900139002' },
        { name: '刘调度', role: '调度员', phone: '13700137003' }
      ],
      urgent: false,
      createdAt: '2026-06-09 08:30',
      checkinStep: 0,
      receiptStatus: 'none'
    },
    {
      id: 'T20260609002',
      status: 'pending',
      startAddr: '苏州市工业园区星湖街328号',
      endAddr: '南京市江宁区秣陵街道将军大道666号',
      startTime: '2026-06-09 16:30',
      endTime: '2026-06-10 06:00',
      cargoName: '服装纺织',
      cargoWeight: '8.2吨',
      cargoVolume: '35立方米',
      cargoType: '轻泡货',
      requirements: ['防潮', '注意防晒'],
      vehicleType: '9.6米厢式货车',
      price: 2600,
      distance: 258,
      contacts: [
        { name: '陈经理', role: '发货人', phone: '13811138111' },
        { name: '赵主管', role: '收货人', phone: '13911139111' }
      ],
      urgent: true,
      createdAt: '2026-06-09 09:15',
      checkinStep: 0,
      receiptStatus: 'none'
    },
    {
      id: 'T20260608005',
      status: 'accepted',
      startAddr: '无锡市新吴区长江南路15号',
      endAddr: '上海市嘉定区安亭镇昌吉路88号',
      startTime: '2026-06-09 09:00',
      endTime: '2026-06-09 18:00',
      cargoName: '汽车零部件',
      cargoWeight: '15.0吨',
      cargoVolume: '32立方米',
      cargoType: '普通货物',
      requirements: ['轻拿轻放', '按顺序装车'],
      vehicleType: '9.6米厢式货车',
      price: 1950,
      distance: 142,
      contacts: [
        { name: '周主管', role: '发货人', phone: '13822238222' },
        { name: '吴经理', role: '收货人', phone: '13922239222' },
        { name: '郑调度', role: '调度员', phone: '13722237222' }
      ],
      urgent: false,
      createdAt: '2026-06-08 16:20',
      acceptedAt: '2026-06-08 16:35',
      checkinStep: 1,
      receiptStatus: 'none'
    },
    {
      id: 'T20260605008',
      status: 'completed',
      startAddr: '宁波市北仑区新碶街道',
      endAddr: '上海市宝山区逸仙路3000号',
      startTime: '2026-06-06 08:00',
      endTime: '2026-06-06 20:00',
      cargoName: '日用百货',
      cargoWeight: '10.8吨',
      cargoVolume: '30立方米',
      cargoType: '普通货物',
      requirements: ['防雨防潮'],
      vehicleType: '9.6米厢式货车',
      price: 3200,
      distance: 225,
      contacts: [
        { name: '孙经理', role: '发货人', phone: '13833338333' }
      ],
      urgent: false,
      createdAt: '2026-06-05 10:00',
      acceptedAt: '2026-06-05 10:20',
      completedAt: '2026-06-06 19:30',
      checkinStep: 3,
      receiptStatus: 'confirmed',
      settlement: {
        basePrice: 3200,
        urgentFee: 0,
        totalIncome: 3200,
        fuelCost: 680,
        tollCost: 320,
        parkingCost: 50,
        otherCost: 0,
        totalCost: 1050,
        totalDeduct: 0,
        totalSubsidy: 0,
        netIncome: 2150
      }
    }
  ];

  var defaultMessages = [
    {
      id: 'M001',
      type: 'dispatch',
      typeName: '调度',
      title: '新任务通知',
      content: '您有一条新的运输任务待接单：无锡→上海，运费1950元，请及时确认。',
      time: '2026-06-09 09:15',
      read: false
    },
    {
      id: 'M002',
      type: 'safety',
      typeName: '安全',
      title: '暴雨天气预警',
      content: '今日长三角地区有雷阵雨，部分路段能见度较低，请减速慢行，注意行车安全。遇积水路段请谨慎通过。',
      time: '2026-06-09 07:30',
      read: false
    },
    {
      id: 'M003',
      type: 'dispatch',
      typeName: '调度',
      title: '任务时间调整',
      content: '任务T20260609001装货时间调整为今日14:00，请合理安排时间，提前到达装货地点。',
      time: '2026-06-09 08:45',
      read: false
    },
    {
      id: 'M004',
      type: 'receipt',
      typeName: '回单',
      title: '电子回单已确认',
      content: '您的任务T20260605008电子回单已签收确认。',
      time: '2026-06-07 10:00',
      read: true,
      taskId: 'T20260605008',
      receipt: {
        taskNo: 'T20260605008',
        startAddr: '宁波市北仑区新碶街道',
        endAddr: '上海市宝山区逸仙路3000号',
        cargoName: '日用百货',
        cargoWeight: '10.8吨',
        signTime: '2026-06-06 19:30',
        signer: '王小明',
        status: '已确认'
      }
    },
    {
      id: 'M005',
      type: 'safety',
      typeName: '安全',
      title: '疲劳驾驶提醒',
      content: '连续驾驶4小时需休息20分钟以上，请注意合理安排休息时间，保持良好状态。',
      time: '2026-06-08 18:00',
      read: true
    }
  ];

  function loadData(key, defaults) {
    try {
      var cached = localStorage.getItem(key);
      if (cached) return JSON.parse(cached);
    } catch (e) { /* ignore */ }
    if (defaults) {
      localStorage.setItem(key, JSON.stringify(defaults));
      return defaults;
    }
    return {};
  }

  function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function showToast(msg) {
    var toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 2000);
  }

  function formatTime(dt) {
    if (!dt) return '--';
    if (typeof dt === 'string') return dt.substring(0, 16).replace('T', ' ');
    var d = new Date(dt);
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0') + ' ' +
      String(d.getHours()).padStart(2, '0') + ':' +
      String(d.getMinutes()).padStart(2, '0');
  }

  function now() {
    var d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0') + 'T' +
      String(d.getHours()).padStart(2, '0') + ':' +
      String(d.getMinutes()).padStart(2, '0');
  }

  var statusMap = {
    pending: { text: '待接单', cls: 'status-pending' },
    accepted: { text: '进行中', cls: 'status-accepted' },
    completed: { text: '已完成', cls: 'status-completed' }
  };

  var appState = {
    currentTab: 'task',
    taskFilter: 'pending',
    msgFilter: 'all',
    expenseType: 'fuel',
    tasks: [],
    expenses: [],
    checkins: [],
    photos: {},
    exceptions: {},
    messages: [],
    currentTaskId: null,
    previewPhotoType: null
  };

  function getAcceptedTasks() {
    return appState.tasks.filter(function (t) { return t.status === 'accepted'; });
  }

  function getCurrentTask() {
    var tid = appState.currentTaskId;
    if (!tid) return null;
    var task = appState.tasks.find(function (t) { return t.id === tid && t.status === 'accepted'; });
    if (!task) {
      var accepted = getAcceptedTasks();
      if (accepted.length > 0) {
        appState.currentTaskId = accepted[0].id;
        saveData(STORAGE_KEYS.CURRENT_TASK, accepted[0].id);
        return accepted[0];
      }
      appState.currentTaskId = null;
      return null;
    }
    return task;
  }

  function setCurrentTask(taskId) {
    appState.currentTaskId = taskId;
    saveData(STORAGE_KEYS.CURRENT_TASK, taskId);
    refreshAllByTask();
  }

  function savePhoto(taskId, type, dataUrl) {
    if (!appState.photos[taskId]) appState.photos[taskId] = {};
    appState.photos[taskId][type] = { dataUrl: dataUrl, time: formatTime(new Date()) };
    saveData(STORAGE_KEYS.PHOTOS, appState.photos);
  }

  function getPhoto(taskId, type) {
    if (!appState.photos[taskId]) return null;
    return appState.photos[taskId][type] || null;
  }

  function removePhoto(taskId, type) {
    if (appState.photos[taskId]) {
      delete appState.photos[taskId][type];
      saveData(STORAGE_KEYS.PHOTOS, appState.photos);
    }
  }

  function getTaskExceptions(taskId) {
    return appState.exceptions[taskId] || [];
  }

  function addTaskException(taskId, exc) {
    if (!appState.exceptions[taskId]) appState.exceptions[taskId] = [];
    appState.exceptions[taskId].push(exc);
    saveData(STORAGE_KEYS.EXCEPTIONS, appState.exceptions);
  }

  function calculateSettlement(taskId) {
    var task = appState.tasks.find(function (t) { return t.id === taskId; });
    if (!task) return null;

    var basePrice = task.price;
    var urgentFee = task.urgent ? Math.round(task.price * 0.08) : 0;
    var totalIncome = basePrice + urgentFee;

    var taskExpenses = appState.expenses.filter(function (e) { return e.taskId === taskId; });
    var fuelCost = taskExpenses.filter(function (e) { return e.type === 'fuel'; }).reduce(function (s, e) { return s + e.amount; }, 0);
    var tollCost = taskExpenses.filter(function (e) { return e.type === 'toll'; }).reduce(function (s, e) { return s + e.amount; }, 0);
    var parkingCost = taskExpenses.filter(function (e) { return e.type === 'parking'; }).reduce(function (s, e) { return s + e.amount; }, 0);
    var otherCost = taskExpenses.filter(function (e) { return e.type === 'other'; }).reduce(function (s, e) { return s + e.amount; }, 0);
    var totalCost = fuelCost + tollCost + parkingCost + otherCost;

    var taskExcs = getTaskExceptions(taskId);
    var totalDeduct = taskExcs.reduce(function (s, e) { return s + (e.deduct || 0); }, 0);
    var totalSubsidy = taskExcs.reduce(function (s, e) { return s + (e.subsidy || 0); }, 0);

    var netIncome = totalIncome - totalCost - totalDeduct + totalSubsidy;

    return {
      basePrice: basePrice,
      urgentFee: urgentFee,
      totalIncome: totalIncome,
      fuelCost: fuelCost,
      tollCost: tollCost,
      parkingCost: parkingCost,
      otherCost: otherCost,
      totalCost: totalCost,
      totalDeduct: totalDeduct,
      totalSubsidy: totalSubsidy,
      netIncome: netIncome > 0 ? netIncome : 0
    };
  }

  function init() {
    appState.tasks = loadData(STORAGE_KEYS.TASKS, defaultTasks);
    appState.expenses = loadData(STORAGE_KEYS.EXPENSES, []);
    appState.checkins = loadData(STORAGE_KEYS.CHECKINS, []);
    appState.photos = loadData(STORAGE_KEYS.PHOTOS, {});
    appState.exceptions = loadData(STORAGE_KEYS.EXCEPTIONS, {});
    appState.messages = loadData(STORAGE_KEYS.MESSAGES, defaultMessages);
    appState.currentTaskId = localStorage.getItem(STORAGE_KEYS.CURRENT_TASK);

    if (!appState.currentTaskId || !appState.tasks.find(function (t) { return t.id === appState.currentTaskId && t.status === 'accepted'; })) {
      var accepted = getAcceptedTasks();
      if (accepted.length > 0) {
        appState.currentTaskId = accepted[0].id;
        saveData(STORAGE_KEYS.CURRENT_TASK, accepted[0].id);
      }
    }

    bindTabNavigation();
    renderTaskList();
    renderMessages();
    renderExpenses();
    renderCheckinStatus();
    renderNavPage();
    renderTaskSwitchers();
    bindTaskTabs();
    bindMsgTabs();
    bindExpenseTypeButtons();
    bindModalEvents();
    bindExpenseForm();
    bindPhotoUpload();
    bindCheckin();
    bindPhotoPreview();
    updateMsgBadge();
  }

  function bindTabNavigation() {
    var navItems = document.querySelectorAll('.bottom-nav .nav-item');
    var titles = {
      task: '运输任务',
      nav: '路线导航',
      checkin: '运输打卡',
      expense: '费用登记',
      message: '消息中心'
    };
    navItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var page = item.getAttribute('data-page');
        switchTab(page);
      });
    });
    function switchTab(page) {
      appState.currentTab = page;
      navItems.forEach(function (n) {
        n.classList.toggle('active', n.getAttribute('data-page') === page);
      });
      var pages = document.querySelectorAll('.tab-page');
      pages.forEach(function (p) { p.classList.remove('active'); });
      document.getElementById('page-' + page).classList.add('active');
      document.getElementById('headerTitle').textContent = titles[page] || '';
    }
    window.switchTab = switchTab;
  }

  function bindTaskTabs() {
    var tabs = document.querySelectorAll('.task-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        appState.taskFilter = tab.getAttribute('data-status');
        renderTaskList();
      });
    });
  }

  function bindMsgTabs() {
    var tabs = document.querySelectorAll('.msg-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        appState.msgFilter = tab.getAttribute('data-type');
        renderMessages();
      });
    });
  }

  function bindExpenseTypeButtons() {
    var btns = document.querySelectorAll('.type-btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        appState.expenseType = btn.getAttribute('data-type');
      });
    });
  }

  function bindModalEvents() {
    document.getElementById('closeDetailModal').addEventListener('click', function () {
      document.getElementById('taskDetailModal').classList.remove('active');
    });
    document.getElementById('closeIncomeModal').addEventListener('click', function () {
      document.getElementById('incomeModal').classList.remove('active');
    });
    document.getElementById('closePhotoModal').addEventListener('click', function () {
      document.getElementById('photoPreviewModal').classList.remove('active');
    });
    document.getElementById('replacePhotoBtn').addEventListener('click', function () {
      var type = appState.previewPhotoType;
      document.getElementById('photoPreviewModal').classList.remove('active');
      if (type) {
        var inputId = 'photo' + type.charAt(0).toUpperCase() + type.slice(1);
        var input = document.getElementById(inputId);
        if (input) input.click();
      }
    });
    document.getElementById('confirmCompleteBtn').addEventListener('click', function () {
      completeTask();
    });

    document.getElementById('backBtn').addEventListener('click', function () {
      document.getElementById('taskDetailModal').classList.remove('active');
      document.getElementById('incomeModal').classList.remove('active');
      document.getElementById('photoPreviewModal').classList.remove('active');
    });
  }

  function bindExpenseForm() {
    document.getElementById('addExpenseBtn').addEventListener('click', addExpense);
    document.getElementById('submitExceptionBtn').addEventListener('click', submitException);
    var dtInput = document.getElementById('expenseTime');
    if (dtInput) dtInput.value = now();
  }

  function bindPhotoUpload() {
    var photoItems = document.querySelectorAll('.photo-item');
    photoItems.forEach(function (item) {
      var type = item.getAttribute('data-type');
      var input = item.querySelector('.photo-input');
      var preview = item.querySelector('.photo-preview');
      var replaceBtn = item.querySelector('.photo-replace');

      input.addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
          var task = getCurrentTask();
          var dataUrl = ev.target.result;

          if (preview) {
            preview.innerHTML = '<img src="' + dataUrl + '" alt="preview" onclick="window.previewPhoto(\'' + type + '\')" />';
          }
          item.classList.add('has-photo');

          if (task) {
            savePhoto(task.id, type, dataUrl);
          }

          showToast(PHOTO_TYPES[type].label + '照片上传成功');
        };
        reader.readAsDataURL(file);
      });

      if (replaceBtn) {
        replaceBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          input.click();
        });
      }
    });
  }

  function bindPhotoPreview() {
    window.previewPhoto = function (type) {
      var task = getCurrentTask();
      if (!task) return;
      var photo = getPhoto(task.id, type);
      if (!photo) return;
      openPhotoPreview(type, PHOTO_TYPES[type].label, photo.dataUrl);
    };
  }

  function openPhotoPreview(type, label, dataUrl) {
    appState.previewPhotoType = type;
    document.getElementById('photoPreviewTitle').textContent = label + '预览';
    document.getElementById('photoPreviewImg').src = dataUrl;
    document.getElementById('photoPreviewModal').classList.add('active');
  }

  function bindCheckin() {
    document.getElementById('checkinBtn').addEventListener('click', doCheckin);
    simulateLocation();
  }

  function simulateLocation() {
    var locations = [
      '上海市浦东新区张江高科技园区附近',
      '杭州市余杭区未来科技城附近',
      '苏州市工业园区附近',
      '无锡市新吴区附近'
    ];
    setTimeout(function () {
      var loc = locations[Math.floor(Math.random() * locations.length)];
      var locText = document.getElementById('locationText');
      var stepLoc = document.getElementById('stepCurLocation');
      if (locText) locText.textContent = loc;
      if (stepLoc) stepLoc.textContent = loc;
    }, 800);
  }

  function renderTaskSwitchers() {
    var accepted = getAcceptedTasks();
    var switchers = ['navTaskSwitcher', 'checkinTaskSwitcher', 'expenseTaskSwitcher'];

    if (accepted.length === 0) {
      switchers.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });
      return;
    }

    var currentTask = getCurrentTask();

    if (accepted.length === 1) {
      switchers.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.style.display = 'block';
        el.innerHTML = '<div class="task-current-badge"><span class="badge-dot"></span>当前任务：' + currentTask.id + ' · ' + currentTask.startAddr.substring(0, 8) + '→' + currentTask.endAddr.substring(0, 8) + '</div>';
      });
    } else {
      switchers.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.style.display = 'block';
        var optionsHtml = accepted.map(function (t) {
          return '<option value="' + t.id + '" ' + (t.id === (currentTask && currentTask.id) ? 'selected' : '') + '>' +
            t.id + ' · ' + t.startAddr.substring(0, 8) + '→' + t.endAddr.substring(0, 8) +
            '</option>';
        }).join('');
        el.innerHTML = '<select class="task-switcher-select" onchange="window.setCurrentTask(this.value)">' +
          '<option value="">-- 选择当前任务 --</option>' +
          optionsHtml +
          '</select>';
      });
    }

    var expenseLabel = document.getElementById('expenseTaskLabel');
    if (expenseLabel) {
      if (currentTask) {
        expenseLabel.textContent = '（归属：' + currentTask.id + '）';
      } else {
        expenseLabel.textContent = '';
      }
    }
  }

  window.setCurrentTask = setCurrentTask;

  function refreshAllByTask() {
    renderTaskSwitchers();
    renderNavPage();
    renderCheckinStatus();
    renderExpenses();
    renderTaskList();
  }

  function renderTaskList() {
    var listEl = document.getElementById('taskList');
    var filter = appState.taskFilter;
    var filtered = appState.tasks.filter(function (t) { return t.status === filter; });

    if (filtered.length === 0) {
      listEl.innerHTML = '<div class="empty-state"><div class="empty-icon" style="font-size:48px">📋</div>暂无' + statusMap[filter].text + '任务</div>';
      return;
    }

    var currentTask = getCurrentTask();
    var currentId = currentTask ? currentTask.id : null;

    var html = '';
    filtered.forEach(function (task) {
      var statusInfo = statusMap[task.status];
      var urgentHtml = task.urgent ? '<span class="badge urgent">加急</span>' : '';
      var isCurrent = task.id === currentId;
      var cardClass = 'task-card' + (isCurrent ? ' task-card-current' : '');
      var footerHtml = '';

      if (task.status === 'pending') {
        footerHtml = '<div class="task-footer">' +
          '<div class="task-price">¥' + task.price.toLocaleString() + ' <small>预估运费</small></div>' +
          '<button class="btn btn-primary" onclick="window.viewTask(\'' + task.id + '\')">查看详情</button>' +
          '</div>';
      } else if (task.status === 'accepted') {
        footerHtml = '<div class="task-footer">' +
          '<div class="task-price">¥' + task.price.toLocaleString() + ' <small>进行中</small></div>' +
          '<div style="display:flex;gap:8px">' +
          (isCurrent ? '<span class="badge" style="background:#1677ff;color:#fff">当前任务</span>' :
            '<button class="btn btn-outline btn-sm" onclick="event.stopPropagation();window.setCurrentTask(\'' + task.id + '\')">设为当前</button>') +
          '<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();window.viewTask(\'' + task.id + '\')">详情</button>' +
          '</div>' +
          '</div>';
      } else {
        var receiptLabel = '';
        if (task.receiptStatus === 'confirmed') {
          receiptLabel = '<span class="task-receipt-status confirmed">回单已确认</span>';
        } else if (task.receiptStatus === 'pending') {
          receiptLabel = '<span class="task-receipt-status pending">回单待确认</span>';
        }
        footerHtml = '<div class="task-footer">' +
          '<div class="price-detail">' +
          '<div class="task-price">¥' + (task.settlement ? task.settlement.netIncome : task.price).toLocaleString() + '</div>' +
          '<div class="price-note">净收入' + receiptLabel + '</div>' +
          '</div>' +
          '<button class="btn btn-outline" onclick="window.viewTask(\'' + task.id + '\')">查看详情</button>' +
          '</div>';
      }

      var tagsHtml = (task.requirements || []).map(function (r) {
        return '<span class="goods-tag">' + r + '</span>';
      }).join('');

      html += '<div class="' + cardClass + '" onclick="window.viewTask(\'' + task.id + '\')">' +
        '<div class="task-header">' +
        '<span class="task-no">' + task.id + '</span>' +
        '<div><span class="task-status ' + statusInfo.cls + '">' + statusInfo.text + '</span> ' + urgentHtml + '</div>' +
        '</div>' +
        '<div class="route-info">' +
        '<div class="route-dots">' +
        '<div class="dot start"></div>' +
        '<div class="route-line"></div>' +
        '<div class="dot end"></div>' +
        '</div>' +
        '<div class="route-addresses">' +
        '<div class="addr-item"><span class="addr-label">装货</span><span class="addr-text">' + task.startAddr + '</span></div>' +
        '<div class="addr-item"><span class="addr-label">卸货</span><span class="addr-text">' + task.endAddr + '</span></div>' +
        '</div>' +
        '</div>' +
        '<div class="task-meta">' +
        '<div class="meta-item"><span class="meta-label">货物:</span>' + task.cargoName + ' · ' + task.cargoWeight + '</div>' +
        '<div class="meta-item"><span class="meta-label">里程:</span>' + task.distance + 'km</div>' +
        '<div class="meta-item"><span class="meta-label">时限:</span><span class="' + (task.urgent ? 'time-warning' : '') + '">' + task.startTime.substring(5) + ' ~ ' + task.endTime.substring(5) + '</span></div>' +
        '</div>' +
        (tagsHtml ? '<div style="margin-top:10px">' + tagsHtml + '</div>' : '') +
        footerHtml +
        '</div>';
    });

    listEl.innerHTML = html;

    var badges = document.querySelectorAll('.task-tab .badge');
    var pendingCount = appState.tasks.filter(function (t) { return t.status === 'pending'; }).length;
    var acceptedCount = appState.tasks.filter(function (t) { return t.status === 'accepted'; }).length;
    if (badges[0]) badges[0].textContent = pendingCount || '';
    if (badges[1]) badges[1].textContent = acceptedCount || '';
  }

  function viewTask(taskId) {
    var task = appState.tasks.find(function (t) { return t.id === taskId; });
    if (!task) return;

    var body = document.getElementById('taskDetailBody');
    var footer = document.getElementById('taskDetailFooter');
    var statusInfo = statusMap[task.status];

    var contactsHtml = (task.contacts || []).map(function (c) {
      return '<div class="contact-row">' +
        '<div class="contact-info">' +
        '<div class="contact-name">' + c.name + '</div>' +
        '<div class="contact-role">' + c.role + ' · ' + c.phone + '</div>' +
        '</div>' +
        '<a class="contact-call" href="tel:' + c.phone + '">' +
        '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>' +
        '</a>' +
        '</div>';
    }).join('');

    var reqHtml = (task.requirements || []).map(function (r) {
      return '<span class="goods-tag">' + r + '</span>';
    }).join('') || '<span style="color:#86909c;font-size:13px">无特殊要求</span>';

    var receiptStatusHtml = '';
    if (task.status === 'completed') {
      if (task.receiptStatus === 'confirmed') {
        receiptStatusHtml = '<div class="detail-row"><span class="detail-label">回单状态</span><span class="detail-value"><span class="task-receipt-status confirmed">已确认</span></span></div>';
      } else if (task.receiptStatus === 'pending') {
        receiptStatusHtml = '<div class="detail-row"><span class="detail-label">回单状态</span><span class="detail-value"><span class="task-receipt-status pending">待确认</span></span></div>';
      }
    }

    body.innerHTML =
      '<div class="detail-section">' +
      '<div class="detail-section-title">运输路线</div>' +
      '<div class="detail-row"><span class="detail-label">装货地址</span><span class="detail-value">' + task.startAddr + '</span></div>' +
      '<div class="detail-row"><span class="detail-label">卸货地址</span><span class="detail-value">' + task.endAddr + '</span></div>' +
      '<div class="detail-row"><span class="detail-label">运输里程</span><span class="detail-value">' + task.distance + ' 公里</span></div>' +
      '<div class="detail-row"><span class="detail-label">时限要求</span><span class="detail-value ' + (task.urgent ? 'time-warning' : '') + '">' + task.startTime + ' ~ ' + task.endTime + (task.urgent ? '（加急）' : '') + '</span></div>' +
      '</div>' +

      '<div class="detail-section">' +
      '<div class="detail-section-title">货物信息</div>' +
      '<div class="detail-row"><span class="detail-label">货物名称</span><span class="detail-value">' + task.cargoName + '</span></div>' +
      '<div class="detail-row"><span class="detail-label">货物类型</span><span class="detail-value">' + task.cargoType + '</span></div>' +
      '<div class="detail-row"><span class="detail-label">重量/体积</span><span class="detail-value">' + task.cargoWeight + ' / ' + task.cargoVolume + '</span></div>' +
      '<div class="detail-row"><span class="detail-label">车型要求</span><span class="detail-value">' + task.vehicleType + '</span></div>' +
      '<div class="detail-row"><span class="detail-label">运输要求</span><span class="detail-value">' + reqHtml + '</span></div>' +
      '</div>' +

      '<div class="detail-section">' +
      '<div class="detail-section-title">联系人</div>' +
      contactsHtml +
      '</div>' +

      '<div class="detail-section">' +
      '<div class="detail-section-title">费用信息</div>' +
      '<div class="detail-row"><span class="detail-label">基础运费</span><span class="detail-value" style="color:#f53f3f;font-weight:700;font-size:16px">¥' + task.price.toLocaleString() + '</span></div>' +
      (task.urgent ? '<div class="detail-row"><span class="detail-label">加急费(8%)</span><span class="detail-value" style="color:#f53f3f">¥' + Math.round(task.price * 0.08).toLocaleString() + '</span></div>' : '') +
      receiptStatusHtml +
      (task.completedAt ? '<div class="detail-row"><span class="detail-label">完成时间</span><span class="detail-value">' + task.completedAt + '</span></div>' : '') +
      (task.acceptedAt ? '<div class="detail-row"><span class="detail-label">接单时间</span><span class="detail-value">' + task.acceptedAt + '</span></div>' : '') +
      '</div>';

    if (task.status === 'pending') {
      footer.innerHTML =
        '<div style="display:flex;gap:10px">' +
        '<button class="btn btn-outline btn-block" onclick="window.rejectTask(\'' + task.id + '\')">暂不接单</button>' +
        '<button class="btn btn-primary btn-block" onclick="window.acceptTask(\'' + task.id + '\')">确认接单</button>' +
        '</div>';
    } else if (task.status === 'accepted') {
      footer.innerHTML =
        '<div style="display:flex;gap:10px">' +
        '<button class="btn btn-outline btn-block" onclick="window.goNav()">查看路线</button>' +
        '<button class="btn btn-primary btn-block" onclick="window.finishTask(\'' + task.id + '\')">查看收入</button>' +
        '</div>';
    } else {
      if (task.receiptStatus === 'pending') {
        footer.innerHTML =
          '<div style="display:flex;gap:10px">' +
          '<button class="btn btn-outline btn-block" onclick="window.viewIncome(\'' + task.id + '\')">查看结算</button>' +
          '<button class="btn btn-primary btn-block" onclick="window.confirmReceipt(\'' + task.id + '\')">确认电子回单</button>' +
          '</div>';
      } else {
        footer.innerHTML = '<button class="btn btn-primary btn-block" onclick="window.viewIncome(\'' + task.id + '\')">查看本趟收入</button>';
      }
    }

    document.getElementById('taskDetailModal').classList.add('active');
  }

  window.viewTask = viewTask;

  window.confirmReceipt = function (taskId) {
    var task = appState.tasks.find(function (t) { return t.id === taskId; });
    if (!task) return;

    task.receiptStatus = 'confirmed';
    saveData(STORAGE_KEYS.TASKS, appState.tasks);

    var msg = appState.messages.find(function (m) { return m.taskId === taskId && m.type === 'receipt'; });
    if (msg && msg.receipt) {
      msg.receipt.status = '已确认';
      saveData(STORAGE_KEYS.MESSAGES, appState.messages);
    } else {
      appState.messages.unshift({
        id: 'M' + Date.now(),
        type: 'receipt',
        typeName: '回单',
        title: '电子回单已确认',
        content: '任务' + taskId + '电子回单您已确认签收。',
        time: formatTime(new Date()),
        read: false,
        taskId: taskId,
        receipt: {
          taskNo: taskId,
          startAddr: task.startAddr,
          endAddr: task.endAddr,
          cargoName: task.cargoName,
          cargoWeight: task.cargoWeight,
          signTime: formatTime(new Date()),
          signer: '司机本人',
          status: '已确认'
        }
      });
      saveData(STORAGE_KEYS.MESSAGES, appState.messages);
    }

    document.getElementById('taskDetailModal').classList.remove('active');
    showToast('电子回单已确认');
    renderTaskList();
    renderMessages();
    updateMsgBadge();
  };

  window.acceptTask = function (taskId) {
    var task = appState.tasks.find(function (t) { return t.id === taskId; });
    if (!task) return;
    task.status = 'accepted';
    task.acceptedAt = formatTime(new Date());
    task.checkinStep = 0;
    task.receiptStatus = 'none';
    appState.currentTaskId = taskId;
    saveData(STORAGE_KEYS.CURRENT_TASK, taskId);
    saveData(STORAGE_KEYS.TASKS, appState.tasks);

    appState.messages.unshift({
      id: 'M' + Date.now(),
      type: 'dispatch',
      typeName: '调度',
      title: '接单成功',
      content: '您已确认接受任务' + taskId + '，请按时前往装货地点。',
      time: formatTime(new Date()),
      read: false
    });
    saveData(STORAGE_KEYS.MESSAGES, appState.messages);

    document.getElementById('taskDetailModal').classList.remove('active');
    showToast('接单成功！');
    renderTaskList();
    renderCheckinStatus();
    renderNavPage();
    renderMessages();
    renderTaskSwitchers();
    updateMsgBadge();

    setTimeout(function () {
      var tabs = document.querySelectorAll('.task-tab');
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tabs[1].classList.add('active');
      appState.taskFilter = 'accepted';
      renderTaskList();
    }, 500);
  };

  window.rejectTask = function (taskId) {
    document.getElementById('taskDetailModal').classList.remove('active');
    showToast('已取消');
  };

  window.goNav = function () {
    document.getElementById('taskDetailModal').classList.remove('active');
    document.querySelector('.bottom-nav .nav-item[data-page="nav"]').click();
  };

  window.finishTask = function (taskId) {
    document.getElementById('taskDetailModal').classList.remove('active');
    showIncome(taskId);
  };

  window.viewIncome = function (taskId) {
    document.getElementById('taskDetailModal').classList.remove('active');
    showIncome(taskId);
  };

  function showIncome(taskId) {
    var task = appState.tasks.find(function (t) { return t.id === taskId; });
    if (!task) return;

    var s = calculateSettlement(taskId);

    var settlementCard = '';
    if (task.status === 'completed') {
      settlementCard =
        '<div class="settlement-card">' +
        '<div class="settlement-title">📋 本趟结算摘要</div>' +
        '<div class="settlement-row"><span>任务单号</span><span>' + task.id + '</span></div>' +
        '<div class="settlement-row"><span>运输路线</span><span>' + task.startAddr.substring(0, 10) + '→' + task.endAddr.substring(0, 10) + '</span></div>' +
        '<div class="settlement-row"><span>完成时间</span><span>' + (task.completedAt || '--') + '</span></div>' +
        '<div class="settlement-row total"><span>净收入</span><span style="color:#00b42a;font-weight:700;font-size:18px">¥' + s.netIncome.toLocaleString() + '</span></div>' +
        '</div>';
    }

    var body = document.getElementById('incomeBody');
    body.innerHTML =
      settlementCard +

      '<div class="detail-section income-summary-card">' +
      '<div class="detail-section-title">运费收入</div>' +
      '<div class="income-item"><span class="income-label">基础运费</span><span class="income-value">¥' + s.basePrice.toLocaleString() + '</span></div>' +
      (task.urgent ? '<div class="income-item"><span class="income-label">加急费(运费×8%)</span><span class="income-value" style="color:#00b42a">+¥' + s.urgentFee.toLocaleString() + '</span></div>' : '') +
      '<div class="income-item"><span class="income-label" style="font-weight:600">收入合计</span><span class="income-value" style="font-weight:700;color:#00b42a">¥' + s.totalIncome.toLocaleString() + '</span></div>' +
      '</div>' +

      '<div class="detail-section">' +
      '<div class="detail-section-title">成本支出</div>' +
      '<div class="income-item"><span class="income-label">⛽ 油费</span><span class="income-value" style="color:#f53f3f">-¥' + s.fuelCost.toLocaleString() + '</span></div>' +
      '<div class="income-item"><span class="income-label">🛣️ 过路费</span><span class="income-value" style="color:#f53f3f">-¥' + s.tollCost.toLocaleString() + '</span></div>' +
      '<div class="income-item"><span class="income-label">🅿️ 停车费</span><span class="income-value" style="color:#f53f3f">-¥' + s.parkingCost.toLocaleString() + '</span></div>' +
      (s.otherCost > 0 ? '<div class="income-item"><span class="income-label">💰 其他费用</span><span class="income-value" style="color:#f53f3f">-¥' + s.otherCost.toLocaleString() + '</span></div>' : '') +
      '<div class="income-item"><span class="income-label" style="font-weight:600">支出合计</span><span class="income-value" style="color:#f53f3f;font-weight:700">-¥' + s.totalCost.toLocaleString() + '</span></div>' +
      '</div>' +

      ((s.totalDeduct > 0 || s.totalSubsidy > 0) ?
        '<div class="detail-section">' +
        '<div class="detail-section-title">异常调整</div>' +
        (s.totalDeduct > 0 ? '<div class="income-item"><span class="income-label"><span class="exception-tag deduct">扣款</span>异常扣款</span><span class="income-value" style="color:#f53f3f">-¥' + s.totalDeduct.toLocaleString() + '</span></div>' : '') +
        (s.totalSubsidy > 0 ? '<div class="income-item"><span class="income-label"><span class="exception-tag subsidy">补贴</span>调度补贴</span><span class="income-value" style="color:#00b42a">+¥' + s.totalSubsidy.toLocaleString() + '</span></div>' : '') +
        '</div>' : '') +

      '<div class="income-total">' +
      '<span class="income-total-label">预估净收入</span>' +
      '<span class="income-total-value">¥' + s.netIncome.toLocaleString() + '</span>' +
      '</div>';

    document.getElementById('incomeModal').classList.add('active');
    document.getElementById('confirmCompleteBtn').setAttribute('data-task', taskId);

    if (task.status === 'completed') {
      document.getElementById('confirmCompleteBtn').textContent = '返回';
    } else {
      document.getElementById('confirmCompleteBtn').textContent = '确认任务完成';
    }
  }

  function completeTask() {
    var taskId = document.getElementById('confirmCompleteBtn').getAttribute('data-task');
    var task = appState.tasks.find(function (t) { return t.id === taskId; });
    if (!task) return;

    if (task.status === 'completed') {
      document.getElementById('incomeModal').classList.remove('active');
      return;
    }

    task.status = 'completed';
    task.completedAt = formatTime(new Date());
    task.checkinStep = 3;
    task.receiptStatus = 'pending';
    task.settlement = calculateSettlement(taskId);
    saveData(STORAGE_KEYS.TASKS, appState.tasks);

    appState.messages.unshift({
      id: 'M' + Date.now(),
      type: 'receipt',
      typeName: '回单',
      title: '电子回单待确认',
      content: '恭喜！任务' + taskId + '已完成，请确认电子回单。',
      time: formatTime(new Date()),
      read: false,
      taskId: taskId,
      receipt: {
        taskNo: taskId,
        startAddr: task.startAddr,
        endAddr: task.endAddr,
        cargoName: task.cargoName,
        cargoWeight: task.cargoWeight,
        signTime: task.completedAt,
        signer: '系统自动',
        status: '待确认'
      }
    });
    saveData(STORAGE_KEYS.MESSAGES, appState.messages);

    document.getElementById('incomeModal').classList.remove('active');
    showToast('任务已完成！请确认电子回单');
    renderTaskList();
    renderCheckinStatus();
    renderNavPage();
    renderMessages();
    renderTaskSwitchers();
    updateMsgBadge();
  }

  function renderNavPage() {
    var emptyEl = document.getElementById('navEmpty');
    var containerEl = document.getElementById('navContainer');

    var currentTask = getCurrentTask();
    if (!currentTask) {
      emptyEl.style.display = 'block';
      containerEl.style.display = 'none';
      return;
    }

    emptyEl.style.display = 'none';
    containerEl.style.display = 'block';

    document.getElementById('navStartAddr').textContent = currentTask.startAddr;
    document.getElementById('navEndAddr').textContent = currentTask.endAddr;
    document.getElementById('navDistance').textContent = currentTask.distance + 'km';
    var hours = Math.floor(currentTask.distance / 60);
    var mins = currentTask.distance % 60;
    document.getElementById('navDuration').textContent = (hours > 0 ? hours + '小时' : '') + mins + '分钟';

    var navBtn = document.getElementById('startNavBtn');
    var newBtn = navBtn.cloneNode(true);
    navBtn.parentNode.replaceChild(newBtn, navBtn);
    newBtn.addEventListener('click', function () {
      showToast('正在调起导航...');
    });
  }

  function renderCheckinStatus() {
    var emptyEl = document.getElementById('checkinEmpty');
    var containerEl = document.getElementById('checkinContainer');

    var currentTask = getCurrentTask();
    if (!currentTask) {
      emptyEl.style.display = 'block';
      containerEl.style.display = 'none';
      return;
    }

    emptyEl.style.display = 'none';
    containerEl.style.display = 'block';

    var step = currentTask.checkinStep || 0;
    var btnTexts = ['到达装货点打卡', '到达休息点打卡', '到达卸货点打卡', '已完成全部打卡'];
    document.getElementById('checkinBtnText').textContent = btnTexts[step] || btnTexts[3];

    var checkinBtn = document.getElementById('checkinBtn');
    if (step >= 3) {
      checkinBtn.disabled = true;
      checkinBtn.style.opacity = '0.6';
    } else {
      checkinBtn.disabled = false;
      checkinBtn.style.opacity = '1';
    }

    var steps = [document.querySelector('#page-checkin .progress-step:first-child'), document.getElementById('step2'), document.getElementById('step3')];
    var lines = [document.getElementById('line1'), document.getElementById('line2')];

    steps.forEach(function (s, i) {
      s.classList.remove('active', 'done');
      if (i < step) s.classList.add('done');
      else if (i === step) s.classList.add('active');
    });

    lines.forEach(function (l, i) {
      l.classList.toggle('done', i < step);
    });

    renderStepDetailCard(currentTask, step);
    renderTaskPhotos(currentTask.id);
    renderCheckinHistory(currentTask.id);
  }

  function renderStepDetailCard(task, step) {
    if (step >= 3) step = 2;
    var meta = STEP_META[step];
    var taskCheckins = appState.checkins.filter(function (c) { return c.taskId === task.id && c.step === step + 1; });
    var hasCheckedIn = taskCheckins.length > 0;

    document.getElementById('stepDetailIcon').textContent = meta.icon;
    document.getElementById('stepDetailName').textContent = meta.name;
    var statusEl = document.getElementById('stepDetailStatus');
    if (hasCheckedIn) {
      statusEl.textContent = '已完成';
      statusEl.className = 'step-detail-status done';
    } else if ((task.checkinStep || 0) > step) {
      statusEl.textContent = '已完成';
      statusEl.className = 'step-detail-status done';
    } else {
      statusEl.textContent = '待打卡';
      statusEl.className = 'step-detail-status';
    }

    document.getElementById('stepPlanTime').textContent = task[meta.timeLabel] || '--';

    var checkinTimeEl = document.getElementById('stepCheckinTime');
    if (hasCheckedIn) {
      checkinTimeEl.textContent = '已打卡 · ' + taskCheckins[0].time;
      checkinTimeEl.style.color = '#00b42a';
    } else {
      checkinTimeEl.textContent = '未打卡';
      checkinTimeEl.style.color = '';
    }
  }

  function renderTaskPhotos(taskId) {
    Object.keys(PHOTO_TYPES).forEach(function (type) {
      var photo = getPhoto(taskId, type);
      var capType = type.charAt(0).toUpperCase() + type.slice(1);
      var previewEl = document.getElementById('preview' + capType);
      var itemEl = document.querySelector('.photo-item[data-type="' + type + '"]');

      if (photo && previewEl) {
        previewEl.innerHTML = '<img src="' + photo.dataUrl + '" alt="preview" onclick="window.previewPhoto(\'' + type + '\')" />';
        if (itemEl) itemEl.classList.add('has-photo');
      } else if (previewEl) {
        previewEl.innerHTML = '';
        if (itemEl) itemEl.classList.remove('has-photo');
      }
    });
  }

  function doCheckin() {
    var currentTask = getCurrentTask();
    if (!currentTask) {
      showToast('请先选择当前任务');
      return;
    }

    var step = currentTask.checkinStep || 0;
    if (step >= 3) {
      showToast('已完成所有打卡');
      return;
    }

    var stepNames = ['装货打卡', '在途休息打卡', '卸货打卡'];
    var locationText = document.getElementById('locationText') ? document.getElementById('locationText').textContent : '定位成功';

    var checkin = {
      id: 'C' + Date.now(),
      taskId: currentTask.id,
      step: step + 1,
      name: stepNames[step],
      time: formatTime(new Date()),
      location: locationText.indexOf('获取') >= 0 ? '定位成功' : locationText
    };

    appState.checkins.unshift(checkin);
    saveData(STORAGE_KEYS.CHECKINS, appState.checkins);

    currentTask.checkinStep = step + 1;
    saveData(STORAGE_KEYS.TASKS, appState.tasks);

    appState.messages.unshift({
      id: 'M' + Date.now(),
      type: 'dispatch',
      typeName: '调度',
      title: stepNames[step] + '成功',
      content: '任务' + currentTask.id + '已完成' + stepNames[step] + '，打卡时间：' + checkin.time,
      time: checkin.time,
      read: false
    });
    saveData(STORAGE_KEYS.MESSAGES, appState.messages);

    showToast(stepNames[step] + '成功！');
    renderCheckinStatus();
    renderMessages();
    renderTaskList();
    updateMsgBadge();
  }

  function renderCheckinHistory(taskId) {
    var listEl = document.getElementById('historyList');
    if (!taskId) {
      var cur = getCurrentTask();
      if (!cur) {
        listEl.innerHTML = '<div class="empty-state" style="padding:20px">暂无打卡记录</div>';
        return;
      }
      taskId = cur.id;
    }

    var list = appState.checkins.filter(function (c) { return c.taskId === taskId; });
    if (list.length === 0) {
      listEl.innerHTML = '<div class="empty-state" style="padding:20px">暂无打卡记录</div>';
      return;
    }

    var icons = { 1: '🏭', 2: '☕', 3: '🏢' };
    listEl.innerHTML = list.map(function (c) {
      return '<div class="history-item">' +
        '<div class="history-icon">' + (icons[c.step] || '📍') + '</div>' +
        '<div class="history-content">' +
        '<div class="history-title">' + c.name + '</div>' +
        '<div class="history-time">' + c.time + '</div>' +
        '<div class="history-location">' + c.location + '</div>' +
        '</div>' +
        '</div>';
    }).join('');
  }

  function addExpense() {
    var currentTask = getCurrentTask();
    if (!currentTask) {
      showToast('请先选择当前任务再登记费用');
      return;
    }

    var amountEl = document.getElementById('expenseAmount');
    var remarkEl = document.getElementById('expenseRemark');
    var timeEl = document.getElementById('expenseTime');

    var amount = parseFloat(amountEl.value);
    if (!amount || amount <= 0) {
      showToast('请输入有效金额');
      return;
    }

    var typeNames = { fuel: '油费', toll: '过路费', parking: '停车费', other: '其他' };

    var expense = {
      id: 'E' + Date.now(),
      taskId: currentTask.id,
      type: appState.expenseType,
      typeName: typeNames[appState.expenseType],
      amount: amount,
      remark: remarkEl.value || '',
      time: timeEl.value ? timeEl.value.replace('T', ' ') : formatTime(new Date())
    };

    appState.expenses.unshift(expense);
    saveData(STORAGE_KEYS.EXPENSES, appState.expenses);

    amountEl.value = '';
    remarkEl.value = '';
    timeEl.value = now();

    showToast('费用登记成功（归属任务：' + currentTask.id + '）');
    renderExpenses();
  }

  function submitException() {
    var currentTask = getCurrentTask();
    if (!currentTask) {
      showToast('请先选择当前任务再提交异常');
      return;
    }

    var typeEl = document.getElementById('exceptionType');
    var descEl = document.getElementById('exceptionDesc');
    var deductEl = document.getElementById('exceptionDeduct');
    var subsidyEl = document.getElementById('exceptionSubsidy');

    if (!typeEl.value) {
      showToast('请选择异常类型');
      return;
    }
    if (!descEl.value.trim()) {
      showToast('请填写异常描述');
      return;
    }

    var deduct = parseFloat(deductEl.value) || 0;
    var subsidy = parseFloat(subsidyEl.value) || 0;

    var typeNames = { traffic: '交通拥堵', weather: '恶劣天气', vehicle: '车辆故障', cargo: '货物异常', other: '其他' };

    var exc = {
      id: 'X' + Date.now(),
      taskId: currentTask.id,
      type: typeEl.value,
      typeName: typeNames[typeEl.value],
      desc: descEl.value,
      deduct: deduct,
      subsidy: subsidy,
      time: formatTime(new Date())
    };
    addTaskException(currentTask.id, exc);

    appState.messages.unshift({
      id: 'M' + Date.now(),
      type: 'dispatch',
      typeName: '调度',
      title: '异常上报-' + typeNames[typeEl.value],
      content: descEl.value + (deduct > 0 ? '（扣款¥' + deduct + '）' : '') + (subsidy > 0 ? '（补贴¥' + subsidy + '）' : ''),
      time: formatTime(new Date()),
      read: false
    });
    saveData(STORAGE_KEYS.MESSAGES, appState.messages);

    typeEl.value = '';
    descEl.value = '';
    deductEl.value = '';
    subsidyEl.value = '';

    showToast('异常已提交，调度员将尽快处理');
    renderMessages();
    updateMsgBadge();
  }

  function renderExpenses() {
    var listEl = document.getElementById('expenseList');
    var currentTask = getCurrentTask();
    var taskExpenses = currentTask ? appState.expenses.filter(function (e) { return e.taskId === currentTask.id; }) : [];

    if (taskExpenses.length === 0) {
      listEl.innerHTML = '<div class="empty-state">暂无费用记录' + (currentTask ? '' : '（请先选择任务）') + '</div>';
      document.getElementById('totalExpense').textContent = '¥0';
      document.getElementById('expenseCount').textContent = '0';
      return;
    }

    var total = taskExpenses.reduce(function (s, e) { return s + e.amount; }, 0);
    document.getElementById('totalExpense').textContent = '¥' + total.toLocaleString();
    document.getElementById('expenseCount').textContent = taskExpenses.length;

    var typeIcons = { fuel: '⛽', toll: '🛣️', parking: '🅿️', other: '💰' };

    listEl.innerHTML = taskExpenses.map(function (e) {
      return '<div class="expense-item">' +
        '<div class="expense-left">' +
        '<div class="expense-icon ' + e.type + '">' + typeIcons[e.type] + '</div>' +
        '<div class="expense-info">' +
        '<div class="expense-type">' + e.typeName + '</div>' +
        '<div class="expense-time">' + e.time + '</div>' +
        (e.remark ? '<div class="expense-remark">' + e.remark + '</div>' : '') +
        '</div>' +
        '</div>' +
        '<div class="expense-amount">-¥' + e.amount.toLocaleString() + '</div>' +
        '</div>';
    }).join('');
  }

  function renderMessages() {
    var listEl = document.getElementById('msgList');
    var filter = appState.msgFilter;
    var list = appState.messages;

    if (filter !== 'all') {
      list = list.filter(function (m) { return m.type === filter; });
    }

    if (list.length === 0) {
      listEl.innerHTML = '<div class="empty-state"><div class="empty-icon" style="font-size:48px">💬</div>暂无消息</div>';
      return;
    }

    var typeIcons = { dispatch: '📢', safety: '⚠️', receipt: '📄', system: '🔔' };

    listEl.innerHTML = list.map(function (m) {
      var receiptHtml = '';
      var confirmBtnHtml = '';
      if (m.receipt) {
        var isPending = m.receipt.status === '待确认';
        receiptHtml = '<div class="receipt-preview">' +
          '<div class="receipt-row"><span class="receipt-label">任务单号</span><span class="receipt-value">' + m.receipt.taskNo + '</span></div>' +
          '<div class="receipt-row"><span class="receipt-label">货物信息</span><span class="receipt-value">' + m.receipt.cargoName + ' / ' + m.receipt.cargoWeight + '</span></div>' +
          '<div class="receipt-row"><span class="receipt-label">签收时间</span><span class="receipt-value">' + m.receipt.signTime + '</span></div>' +
          '<div class="receipt-row"><span class="receipt-label">签收人</span><span class="receipt-value">' + m.receipt.signer + '（' + m.receipt.status + '）</span></div>' +
          (isPending && m.taskId ?
            '<div style="margin-top:12px"><button class="btn btn-primary btn-block btn-sm" onclick="event.stopPropagation();window.confirmReceipt(\'' + m.taskId + '\')">确认电子回单</button></div>' : '') +
          '</div>';
      }

      return '<div class="msg-item ' + (m.read ? '' : 'unread') + '" onclick="window.markRead(\'' + m.id + '\')">' +
        '<div class="msg-header">' +
        '<div class="msg-icon ' + m.type + '">' + typeIcons[m.type] + '</div>' +
        '<div class="msg-title-row">' +
        '<div class="msg-title">' + m.title + '</div>' +
        '<div class="msg-time">' + m.time + '</div>' +
        '</div>' +
        '</div>' +
        '<div class="msg-content">' +
        '<span class="msg-tag ' + m.type + '">' + m.typeName + '</span>' +
        m.content +
        receiptHtml +
        '</div>' +
        '</div>';
    }).join('');
  }

  window.markRead = function (msgId) {
    var msg = appState.messages.find(function (m) { return m.id === msgId; });
    if (msg && !msg.read) {
      msg.read = true;
      saveData(STORAGE_KEYS.MESSAGES, appState.messages);
      renderMessages();
      updateMsgBadge();
    }
  };

  function updateMsgBadge() {
    var unread = appState.messages.filter(function (m) { return !m.read; }).length;
    var badge = document.querySelector('.msg-badge');
    if (badge) {
      if (unread > 0) {
        badge.textContent = unread;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();