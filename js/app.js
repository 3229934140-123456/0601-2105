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
      receiptConfirmedAt: '2026-06-07 10:00',
      settlementStatus: 'paid',
      paidInfo: {
        paidTime: '2026-06-08 15:30',
        paidAccount: '工商银行 ****6688',
        transactionId: 'YT20260608001530221'
      },
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
        totalSubsidy: 200,
        pendingDeduct: 0,
        pendingSubsidy: 0,
        netIncome: 2350
      }
    }
  ];

  var defaultExpenses = [
    { id: 'E001', taskId: 'T20260605008', type: 'fuel', typeName: '油费', amount: 450, remark: '北仑服务区中石化', time: '2026-06-06 09:30' },
    { id: 'E002', taskId: 'T20260605008', type: 'fuel', typeName: '油费', amount: 230, remark: '杭州湾环线加油站', time: '2026-06-06 15:20' },
    { id: 'E003', taskId: 'T20260605008', type: 'toll', typeName: '过路费', amount: 320, remark: '宁波北-上海江桥', time: '2026-06-06 19:00' },
    { id: 'E004', taskId: 'T20260605008', type: 'parking', typeName: '停车费', amount: 50, remark: '宝山物流园过夜', time: '2026-06-06 20:15' }
  ];

  var defaultExceptions = {
    'T20260605008': [
      {
        id: 'X001',
        taskId: 'T20260605008',
        type: 'traffic',
        typeName: '交通拥堵',
        desc: 'G15沈海高速嘉兴段遇交通事故堵车2小时',
        deduct: 0,
        subsidy: 200,
        status: 'resolved',
        handler: '李调度',
        handleNote: '情况属实，考虑到拥堵严重影响时效，给予200元时效补贴',
        handleTime: '2026-06-06 21:00',
        time: '2026-06-06 14:30'
      }
    ]
  };

  var defaultPhotos = {};
  var SAMPLE_SIGN_IMG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCBmaWxsPSIjZmZmIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiPuepu+WItuWbvueJh+WKoOW3peihjOeJiCjwn5mC4piV6L+H8J+OikK3d3dy5pbnNwYWNlLmNvbS90cmFuc3BvcnQ8L3RleHQ+PC9zdmc+';
  var SAMPLE_WEIGHT_IMG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCBmaWxsPSIjZmZmIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMzMzIj7mnKzmloflj5/liqYg54q26YePMC44dOaVsOKAljEwLjg0VE/KuWbvvIzkuK3mnKzpo47pm4bovazmnaXlj6/ku6XorqHnq5sKMjAyNi0wNi0wNiAwODoxMjo0NQo8L3RleHQ+PC9zdmc+';
  defaultPhotos['T20260605008'] = {
    sign: { dataUrl: SAMPLE_SIGN_IMG, time: '2026-06-06 19:30' },
    weight: { dataUrl: SAMPLE_WEIGHT_IMG, time: '2026-06-06 08:15' }
  };

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
    completedFilter: 'all',
    completedView: 'taskList',
    expandedMonth: null,
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
    var resolvedExcs = taskExcs.filter(function (e) { return e.status === 'resolved'; });
    var pendingExcs = taskExcs.filter(function (e) { return e.status !== 'resolved'; });
    var totalDeduct = resolvedExcs.reduce(function (s, e) { return s + (e.deduct || 0); }, 0);
    var totalSubsidy = resolvedExcs.reduce(function (s, e) { return s + (e.subsidy || 0); }, 0);
    var pendingDeduct = pendingExcs.reduce(function (s, e) { return s + (e.deduct || 0); }, 0);
    var pendingSubsidy = pendingExcs.reduce(function (s, e) { return s + (e.subsidy || 0); }, 0);

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
      pendingDeduct: pendingDeduct,
      pendingSubsidy: pendingSubsidy,
      netIncome: netIncome
    };
  }

  function init() {
    var rawTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    var needReset = false;
    if (rawTasks) {
      try {
        var parsed = JSON.parse(rawTasks);
        var hasSettlementField = parsed.every(function (t) {
          return t.status !== 'completed' || t.settlementStatus !== undefined;
        });
        if (!hasSettlementField) needReset = true;
      } catch (e) { needReset = true; }
    }
    if (needReset) {
      Object.keys(STORAGE_KEYS).forEach(function (k) {
        try { localStorage.removeItem(STORAGE_KEYS[k]); } catch (e) {}
      });
    }

    appState.tasks = loadData(STORAGE_KEYS.TASKS, defaultTasks);
    appState.expenses = loadData(STORAGE_KEYS.EXPENSES, defaultExpenses);
    appState.checkins = loadData(STORAGE_KEYS.CHECKINS, []);
    appState.photos = loadData(STORAGE_KEYS.PHOTOS, defaultPhotos);
    appState.exceptions = loadData(STORAGE_KEYS.EXCEPTIONS, defaultExceptions);
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

        var subTabs = document.getElementById('completedSubTabs');
        var viewSwitcher = document.getElementById('completedViewSwitcher');
        if (appState.taskFilter === 'completed') {
          subTabs.style.display = 'flex';
          viewSwitcher.style.display = 'flex';
          if (appState.completedView === 'taskList') {
            document.getElementById('taskList').style.display = 'block';
            document.getElementById('monthlyView').style.display = 'none';
          } else {
            document.getElementById('taskList').style.display = 'none';
            document.getElementById('monthlyView').style.display = 'block';
            renderMonthlyView();
          }
        } else {
          subTabs.style.display = 'none';
          viewSwitcher.style.display = 'none';
          document.getElementById('taskList').style.display = 'block';
          document.getElementById('monthlyView').style.display = 'none';
        }
        renderTaskList();
      });
    });

    var subTabs = document.querySelectorAll('.subtask-tab');
    subTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        subTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        appState.completedFilter = tab.getAttribute('data-settle');
        renderTaskList();
      });
    });

    document.getElementById('viewTaskListBtn').addEventListener('click', function () {
      document.getElementById('viewTaskListBtn').classList.add('active');
      document.getElementById('viewMonthlyBtn').classList.remove('active');
      appState.completedView = 'taskList';
      document.getElementById('taskList').style.display = 'block';
      document.getElementById('monthlyView').style.display = 'none';
      renderTaskList();
    });

    document.getElementById('viewMonthlyBtn').addEventListener('click', function () {
      document.getElementById('viewMonthlyBtn').classList.add('active');
      document.getElementById('viewTaskListBtn').classList.remove('active');
      appState.completedView = 'monthly';
      document.getElementById('taskList').style.display = 'none';
      document.getElementById('monthlyView').style.display = 'block';
      renderMonthlyView();
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

    if (filter === 'completed' && appState.completedFilter !== 'all') {
      filtered = filtered.filter(function (t) {
        return t.settlementStatus === appState.completedFilter;
      });
    }

    if (filtered.length === 0) {
      listEl.innerHTML = '<div class="empty-state"><div class="empty-icon" style="font-size:48px">📋</div>暂无' + statusMap[filter].text + '任务</div>';
      return;
    }

    var settleStatusMap = {
      unsettled: { text: '未结算', cls: 'task-receipt-status pending' },
      to_pay: { text: '待打款', cls: 'task-receipt-status pending' },
      paid: { text: '已到账', cls: 'task-receipt-status confirmed' }
    };

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
        var settleStatus = settleStatusMap[task.settlementStatus] || settleStatusMap.unsettled;
        var net = task.settlement ? task.settlement.netIncome : 0;
        var netCls = net < 0 ? 'net-income negative' : '';
        footerHtml = '<div class="task-footer">' +
          '<div class="price-detail">' +
          '<div class="task-price ' + netCls + '">' + (net < 0 ? '-' : '') + '¥' + Math.abs(net).toLocaleString() + '</div>' +
          '<div class="price-note">净收入 ' + settleStatus.text + ' ' + receiptLabel + '</div>' +
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

    var receiptDetailHtml = '';
    if (task.status === 'completed') {
      var statusLabel = task.receiptStatus === 'confirmed' ?
        '<span class="task-receipt-status confirmed">已确认</span>' :
        '<span class="task-receipt-status pending">待确认</span>';
      receiptDetailHtml = '<div class="detail-section">' +
        '<div class="detail-section-title">电子回单</div>' +
        '<div class="receipt-sign-card">' +
        '<div class="receipt-sign-title">📄 签收信息 ' + statusLabel + '</div>' +
        '<div class="receipt-row"><span class="receipt-label">任务单号</span><span class="receipt-value">' + task.id + '</span></div>' +
        '<div class="receipt-row"><span class="receipt-label">签收时间</span><span class="receipt-value">' + (task.completedAt || '--') + '</span></div>' +
        '<div class="receipt-row"><span class="receipt-label">签收人</span><span class="receipt-value">收货方</span></div>' +
        (task.receiptConfirmedAt ? '<div class="receipt-row"><span class="receipt-label">司机确认时间</span><span class="receipt-value">' + task.receiptConfirmedAt + '</span></div>' : '') +
        '<div style="font-size:13px;color:#1f2329;font-weight:600;margin-top:10px">司机上传凭证</div>' +
        renderReceiptPhotos(taskId) +
        (task.receiptStatus === 'pending' ?
          '<div style="margin-top:12px"><button class="btn btn-primary btn-block" onclick="event.stopPropagation();window.confirmReceipt(\'' + task.id + '\')">确认电子回单</button></div>' : '') +
        '</div></div>';
    }

    var exceptionHtml = renderExceptionCards(taskId);
    var expenseGroupHtml = task.status === 'completed' ? renderExpenseGroupDetail(taskId) : '';
    var timelineHtml = renderTimeline(taskId);

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
      (task.urgent ? '<div class="detail-row"><span class="detail-label">加急费(运费×8%)</span><span class="detail-value" style="color:#00b42a;font-weight:600">+¥' + Math.round(task.price * 0.08).toLocaleString() + '</span></div>' : '') +
      receiptStatusHtml +
      (task.completedAt ? '<div class="detail-row"><span class="detail-label">完成时间</span><span class="detail-value">' + task.completedAt + '</span></div>' : '') +
      (task.acceptedAt ? '<div class="detail-row"><span class="detail-label">接单时间</span><span class="detail-value">' + task.acceptedAt + '</span></div>' : '') +
      '</div>' +

      receiptDetailHtml +
      exceptionHtml +
      expenseGroupHtml +
      timelineHtml;

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
    task.receiptConfirmedAt = formatTime(new Date());
    if (!task.settlementStatus || task.settlementStatus === 'unsettled') {
      task.settlementStatus = 'to_pay';
    }
    if (!task.paidInfo) {
      task.paidInfo = null;
    }
    saveData(STORAGE_KEYS.TASKS, appState.tasks);

    var confirmTime = formatTime(new Date());
    var hasReceiptMsg = false;
    appState.messages.forEach(function (m) {
      if (m.taskId === taskId && m.type === 'receipt') {
        hasReceiptMsg = true;
        m.title = '电子回单已确认';
        m.content = '任务' + taskId + '电子回单您已确认签收，确认时间：' + confirmTime;
        if (m.receipt) {
          m.receipt.status = '已确认';
          m.receipt.confirmTime = confirmTime;
        }
      }
    });

    if (!hasReceiptMsg) {
      appState.messages.unshift({
        id: 'M' + Date.now(),
        type: 'receipt',
        typeName: '回单',
        title: '电子回单已确认',
        content: '任务' + taskId + '电子回单您已确认签收，确认时间：' + confirmTime,
        time: confirmTime,
        read: false,
        taskId: taskId,
        receipt: {
          taskNo: taskId,
          startAddr: task.startAddr,
          endAddr: task.endAddr,
          cargoName: task.cargoName,
          cargoWeight: task.cargoWeight,
          signTime: task.completedAt || confirmTime,
          signer: '司机本人',
          confirmTime: confirmTime,
          status: '已确认'
        }
      });
    }
    saveData(STORAGE_KEYS.MESSAGES, appState.messages);

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

  function getSettlementStatusInfo(status) {
    var map = {
      unsettled: { text: '未结算', step: 1 },
      to_pay: { text: '待打款', step: 2 },
      paid: { text: '已到账', step: 3 }
    };
    return map[status] || map.unsettled;
  }

  function renderSettlementProgress(task) {
    var info = getSettlementStatusInfo(task.settlementStatus);
    var currentStep = info.step;
    var steps = [
      { label: '任务完成', icon: '✓' },
      { label: '待打款', icon: '💰' },
      { label: '已到账', icon: '✅' }
    ];
    var line1 = currentStep >= 2 ? 'sp-line done' : 'sp-line';
    var line2 = currentStep >= 3 ? 'sp-line done' : 'sp-line';
    var html = '<div class="settlement-progress">';
    html += '<div class="' + line1 + '" style="left:16.6%;right:50%"></div>';
    html += '<div class="' + line2 + '" style="left:50%;right:16.6%"></div>';
    steps.forEach(function (st, idx) {
      var stepNum = idx + 1;
      var cls = '';
      if (stepNum < currentStep) cls = 'done';
      else if (stepNum === currentStep) cls = 'active';
      html += '<div class="sp-step ' + cls + '"><div class="sp-dot">' + st.icon + '</div><div class="sp-label">' + st.label + '</div></div>';
    });
    html += '</div>';
    return html;
  }

  function renderPaidInfo(task) {
    if (task.settlementStatus !== 'paid' || !task.paidInfo) return '';
    return '<div class="paid-info-card">' +
      '<div class="paid-info-title">✅ 打款已到账</div>' +
      '<div class="paid-info-row"><span class="paid-label">到账时间</span><span class="paid-value">' + task.paidInfo.paidTime + '</span></div>' +
      '<div class="paid-info-row"><span class="paid-label">收款账户</span><span class="paid-value">' + task.paidInfo.paidAccount + '</span></div>' +
      '<div class="paid-info-row"><span class="paid-label">流水号</span><span class="paid-value">' + task.paidInfo.transactionId + '</span></div>' +
      '</div>';
  }

  function showIncome(taskId) {
    var task = appState.tasks.find(function (t) { return t.id === taskId; });
    if (!task) return;

    var s = calculateSettlement(taskId);
    var netNegative = s.netIncome < 0;
    var netDisplay = (netNegative ? '-' : '') + '¥' + Math.abs(s.netIncome).toLocaleString();
    var netCls = netNegative ? 'negative' : '';

    var settleInfo = getSettlementStatusInfo(task.settlementStatus);
    var settleProgress = task.status === 'completed' ? renderSettlementProgress(task) : '';
    var paidInfoHtml = task.status === 'completed' ? renderPaidInfo(task) : '';

    var pendingBanner = '';
    if (task.status === 'completed' && (s.pendingDeduct > 0 || s.pendingSubsidy > 0)) {
      pendingBanner = '<div class="pending-adjust-banner">' +
        '⚠️ <strong>待确认调整：</strong>调度处理中，暂不计入本趟净收入。' +
        (s.pendingDeduct > 0 ? ' 待扣款 ¥' + s.pendingDeduct.toLocaleString() : '') +
        (s.pendingSubsidy > 0 ? ' 待补贴 ¥' + s.pendingSubsidy.toLocaleString() : '') +
        '，处理完成后自动更新。' +
        '</div>';
    }

    var formulaHtml = '';
    if (task.status === 'completed') {
      formulaHtml = '<div class="formula-hint">' +
        '<div>计算公式：</div>' +
        '<div>净收入 = <span class="f-num">¥' + s.totalIncome.toLocaleString() + '</span>(收入合计)' +
        ' - <span class="f-num">¥' + s.totalCost.toLocaleString() + '</span>(支出合计)' +
        (s.totalSubsidy > 0 ? ' + <span class="f-num">¥' + s.totalSubsidy.toLocaleString() + '</span>(补贴)' : '') +
        (s.totalDeduct > 0 ? ' - <span class="f-num">¥' + s.totalDeduct.toLocaleString() + '</span>(扣款)' : '') +
        ' = <span class="f-num" style="color:' + (netNegative ? '#f53f3f' : '#00b42a') + '">' + netDisplay + '</span>' +
        '</div>' +
        (s.pendingDeduct > 0 || s.pendingSubsidy > 0 ? '<div style="margin-top:4px;color:#ad4e00">另有 <span class="f-num">¥' +
          ((s.pendingDeduct || 0) + (s.pendingSubsidy || 0)).toLocaleString() +
          '</span> 待调度确认，未计入以上公式。</div>' : '') +
        '</div>';
    }

    var settlementCard = '';
    if (task.status === 'completed') {
      var urgentHtml = task.urgent ?
        '<div class="settlement-row"><span>加急费(运费×8%)</span><span style="color:#00b42a">+¥' + s.urgentFee.toLocaleString() + '</span></div>' : '';
      settlementCard =
        '<div class="settlement-card">' +
        '<div class="settlement-title">📋 本趟结算摘要</div>' +
        '<div class="settlement-row"><span>任务单号</span><span>' + task.id + (task.urgent ? ' <span class="badge urgent">加急</span>' : '') + '</span></div>' +
        '<div class="settlement-row"><span>运输路线</span><span>' + task.startAddr.substring(0, 10) + '→' + task.endAddr.substring(0, 10) + '</span></div>' +
        '<div class="settlement-row"><span>完成时间</span><span>' + (task.completedAt || '--') + '</span></div>' +
        '<div class="settlement-row"><span>结算状态</span><span>' + settleInfo.text + '</span></div>' +
        '<div class="settlement-row"><span>基础运费</span><span>¥' + s.basePrice.toLocaleString() + '</span></div>' +
        urgentHtml +
        '<div class="settlement-row"><span>成本支出</span><span style="color:#f53f3f">-¥' + s.totalCost.toLocaleString() + '</span></div>' +
        (s.totalDeduct > 0 ? '<div class="settlement-row"><span>异常扣款</span><span style="color:#f53f3f">-¥' + s.totalDeduct.toLocaleString() + '</span></div>' : '') +
        (s.totalSubsidy > 0 ? '<div class="settlement-row"><span>调度补贴</span><span style="color:#00b42a">+¥' + s.totalSubsidy.toLocaleString() + '</span></div>' : '') +
        (s.pendingDeduct > 0 ? '<div class="settlement-row"><span>待确认扣款</span><span style="color:#ff9500">¥' + s.pendingDeduct.toLocaleString() + ' (待处理)</span></div>' : '') +
        (s.pendingSubsidy > 0 ? '<div class="settlement-row"><span>待确认补贴</span><span style="color:#ff9500">¥' + s.pendingSubsidy.toLocaleString() + ' (待处理)</span></div>' : '') +
        '<div class="settlement-row total"><span>净收入</span><span class="net-income ' + netCls + '" style="font-weight:700;font-size:18px">' + netDisplay + '</span></div>' +
        '</div>' +
        settleProgress +
        paidInfoHtml +
        pendingBanner;
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

      ((s.totalDeduct > 0 || s.totalSubsidy > 0 || s.pendingDeduct > 0 || s.pendingSubsidy > 0) ?
        '<div class="detail-section">' +
        '<div class="detail-section-title">异常调整 <span class="settlement-trace-link" onclick="document.getElementById(\'closeIncomeModal\').click();window.viewTask(\'' + taskId + '\')">查看来源 →</span></div>' +
        (s.totalDeduct > 0 ? '<div class="income-item"><span class="income-label"><span class="exception-tag deduct">扣款</span>已处理扣款</span><span class="income-value" style="color:#f53f3f">-¥' + s.totalDeduct.toLocaleString() + '</span></div>' : '') +
        (s.totalSubsidy > 0 ? '<div class="income-item"><span class="income-label"><span class="exception-tag subsidy">补贴</span>已处理补贴</span><span class="income-value" style="color:#00b42a">+¥' + s.totalSubsidy.toLocaleString() + '</span></div>' : '') +
        (s.pendingDeduct > 0 ? '<div class="income-item"><span class="income-label"><span class="exception-tag" style="background:#fff7e8;color:#ff9500;border:1px solid #ffd591">待处理</span>待确认扣款</span><span class="income-value" style="color:#ff9500">¥' + s.pendingDeduct.toLocaleString() + ' (暂不计入)</span></div>' : '') +
        (s.pendingSubsidy > 0 ? '<div class="income-item"><span class="income-label"><span class="exception-tag" style="background:#fff7e8;color:#ff9500;border:1px solid #ffd591">待处理</span>待确认补贴</span><span class="income-value" style="color:#ff9500">¥' + s.pendingSubsidy.toLocaleString() + ' (暂不计入)</span></div>' : '') +
        '</div>' : '') +

      formulaHtml +

      '<div class="income-total">' +
      '<span class="income-total-label">' + (task.status === 'completed' ? '本趟净收入' : '预估净收入') + '</span>' +
      '<span class="income-total-value net-income ' + netCls + '">' + netDisplay + '</span>' +
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
    task.settlementStatus = 'unsettled';
    task.paidInfo = null;
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
    var submitTime = formatTime(new Date());

    var exc = {
      id: 'X' + Date.now(),
      taskId: currentTask.id,
      type: typeEl.value,
      typeName: typeNames[typeEl.value],
      desc: descEl.value,
      deduct: deduct,
      subsidy: subsidy,
      status: 'pending',
      handler: null,
      handleNote: null,
      handleTime: null,
      time: submitTime
    };
    addTaskException(currentTask.id, exc);

    appState.messages.unshift({
      id: 'M' + Date.now(),
      type: 'dispatch',
      typeName: '调度',
      title: '异常上报-' + typeNames[typeEl.value] + '（待处理）',
      content: descEl.value + (deduct > 0 ? '（申请扣款¥' + deduct + '）' : '') + (subsidy > 0 ? '（申请补贴¥' + subsidy + '）' : '') + '，已提交调度处理。',
      time: submitTime,
      read: false
    });
    saveData(STORAGE_KEYS.MESSAGES, appState.messages);

    setTimeout(function () {
      exc.status = 'resolved';
      exc.handler = '刘调度';
      if (subsidy > 0) {
        exc.handleNote = '情况核实，同意补贴¥' + subsidy + '，将计入本趟结算。';
      } else if (deduct > 0) {
        exc.handleNote = '情况核实，扣款¥' + deduct + '，已在结算中扣除。';
      } else {
        exc.handleNote = '情况已记录，注意行车安全。';
      }
      exc.handleTime = formatTime(new Date());
      saveData(STORAGE_KEYS.EXCEPTIONS, appState.exceptions);

      var task = appState.tasks.find(function (t) { return t.id === currentTask.id; });
      if (task && task.status === 'completed') {
        task.settlement = calculateSettlement(task.id);
        saveData(STORAGE_KEYS.TASKS, appState.tasks);
        renderTaskList();
      }

      appState.messages.unshift({
        id: 'M' + Date.now(),
        type: 'dispatch',
        typeName: '调度',
        title: '异常处理完成-' + exc.typeName,
        content: exc.handleNote + '（处理人：' + exc.handler + '）',
        time: exc.handleTime,
        read: false
      });
      saveData(STORAGE_KEYS.MESSAGES, appState.messages);
      renderMessages();
      updateMsgBadge();
    }, 5000);

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

  window.previewReceiptPhoto = function (taskId, type) {
    var photo = getPhoto(taskId, type);
    if (!photo) return;
    openPhotoPreview(type, PHOTO_TYPES[type] ? PHOTO_TYPES[type].label : '签收凭证', photo.dataUrl);
  };

  function renderReceiptPhotos(taskId) {
    var photos = appState.photos[taskId] || {};
    var types = Object.keys(photos);
    if (types.length === 0) return '<div style="font-size:12px;color:#86909c;margin-top:6px">暂无上传凭证</div>';

    var html = '<div class="receipt-photos">';
    types.forEach(function (type) {
      var p = photos[type];
      var label = PHOTO_TYPES[type] ? PHOTO_TYPES[type].label : type;
      html += '<div class="receipt-photo-item" onclick="window.previewReceiptPhoto(\'' + taskId + '\',\'' + type + '\')">' +
        '<img src="' + p.dataUrl + '" alt="' + label + '" />' +
        '<div class="photo-type-tag">' + label + '</div>' +
        '</div>';
    });
    html += '</div>';
    return html;
  }

  function renderExceptionCards(taskId) {
    var list = getTaskExceptions(taskId);
    if (list.length === 0) return '';

    var html = '<div class="detail-section">' +
      '<div class="detail-section-title">异常记录</div>';

    list.forEach(function (exc) {
      var statusLabel = exc.status === 'resolved' ? '已处理' : '待处理';
      var statusCls = exc.status === 'resolved' ? 'resolved' : 'pending';
      var resultHtml = '';
      if (exc.status === 'resolved') {
        resultHtml = '<div class="exception-result">' +
          '<div class="exception-result-row"><span>处理人</span><span>' + exc.handler + '</span></div>' +
          '<div class="exception-result-row"><span>处理时间</span><span>' + exc.handleTime + '</span></div>' +
          '<div class="exception-result-row"><span>处理说明</span><span style="color:#4e5969;text-align:right;max-width:60%">"' + exc.handleNote + '"</span></div>' +
          (exc.deduct > 0 ? '<div class="exception-result-row" style="color:#f53f3f;font-weight:600"><span>扣款金额</span><span>-¥' + exc.deduct.toLocaleString() + '</span></div>' : '') +
          (exc.subsidy > 0 ? '<div class="exception-result-row" style="color:#00b42a;font-weight:600"><span>补贴金额</span><span>+¥' + exc.subsidy.toLocaleString() + '</span></div>' : '') +
          '</div>';
      }
      html += '<div class="exception-card">' +
        '<div class="exception-card-header">' +
        '<span class="exception-type">' + exc.typeName + '</span>' +
        '<span class="exception-status ' + statusCls + '">' + statusLabel + '</span>' +
        '</div>' +
        '<div class="exception-desc">' + exc.desc + '</div>' +
        '<div class="exception-meta">' +
        '<span>上报时间：' + exc.time + '</span>' +
        ((exc.deduct > 0 || exc.subsidy > 0) ?
          '<span>' + (exc.deduct > 0 ? '<span style="color:#f53f3f">扣款¥' + exc.deduct + '</span>' : '') +
          (exc.subsidy > 0 ? '<span style="color:#00b42a"> 补贴¥' + exc.subsidy + '</span>' : '') + '</span>' : '') +
        '</div>' +
        resultHtml +
        '</div>';
    });

    html += '</div>';
    return html;
  }

  function renderExpenseGroupDetail(taskId) {
    var taskExpenses = appState.expenses.filter(function (e) { return e.taskId === taskId; });
    if (taskExpenses.length === 0) return '';

    var groups = [
      { key: 'fuel', label: '⛽ 油费', type: 'cost' },
      { key: 'toll', label: '🛣️ 过路费', type: 'cost' },
      { key: 'parking', label: '🅿️ 停车费', type: 'cost' },
      { key: 'other', label: '💰 其他费用', type: 'cost' }
    ];

    var html = '<div class="detail-section">' +
      '<div class="detail-section-title">费用明细（按类型分组）</div>';

    var totalCost = 0;
    groups.forEach(function (g) {
      var items = taskExpenses.filter(function (e) { return e.type === g.key; });
      if (items.length === 0) return;
      var sum = items.reduce(function (s, e) { return s + e.amount; }, 0);
      totalCost += sum;

      html += '<div class="expense-group">' +
        '<div class="expense-group-title"><span>' + g.label + '（' + items.length + '笔）</span>' +
        '<span class="group-amount">-¥' + sum.toLocaleString() + '</span></div>' +
        '<div class="expense-group-list">';
      items.forEach(function (e) {
        html += '<div class="expense-group-item">' +
          '<div><div>' + (e.remark || e.typeName) + '</div><div class="item-time">' + e.time + '</div></div>' +
          '<div style="color:#f53f3f">-¥' + e.amount.toLocaleString() + '</div>' +
          '</div>';
      });
      html += '</div></div>';
    });

    var excs = getTaskExceptions(taskId);
    var totalDeduct = excs.reduce(function (s, e) { return s + (e.deduct || 0); }, 0);
    var totalSubsidy = excs.reduce(function (s, e) { return s + (e.subsidy || 0); }, 0);

    if (totalDeduct > 0 || totalSubsidy > 0) {
      html += '<div class="expense-group"><div class="expense-group-title">' +
        '<span>⚠️ 异常调整</span><span>';
      if (totalSubsidy > 0) html += '<span class="group-amount positive">+¥' + totalSubsidy.toLocaleString() + '</span>';
      if (totalDeduct > 0) html += '<span class="group-amount"> -¥' + totalDeduct.toLocaleString() + '</span>';
      html += '</span></div><div class="expense-group-list">';
      excs.forEach(function (e) {
        if (e.deduct === 0 && e.subsidy === 0) return;
        var amtHtml = '';
        if (e.subsidy > 0) amtHtml += '<span style="color:#00b42a">+¥' + e.subsidy + '</span>';
        if (e.deduct > 0) amtHtml += '<span style="color:#f53f3f"> -¥' + e.deduct + '</span>';
        html += '<div class="expense-group-item">' +
          '<div><div>' + e.typeName + ' <span style="color:#86909c">(' + (e.status === 'resolved' ? '已处理' : '待处理') + ')</span></div>' +
          '<div class="item-time">' + e.time + ' · ' + (e.handleNote || e.desc) + '</div></div>' +
          '<div>' + amtHtml + '</div>' +
          '</div>';
      });
      html += '</div></div>';
    }

    var task = appState.tasks.find(function (t) { return t.id === taskId; });
    if (task && task.urgent) {
      var uFee = Math.round(task.price * 0.08);
      html += '<div class="expense-group"><div class="expense-group-title">' +
        '<span>🚀 加急费（运费×8%）</span><span class="group-amount positive">+¥' + uFee.toLocaleString() + '</span>' +
        '</div></div>';
    }

    html += '</div>';
    return html;
  }

  function buildTimeline(taskId) {
    var task = appState.tasks.find(function (t) { return t.id === taskId; });
    if (!task) return [];
    var items = [];

    if (task.createdAt) {
      items.push({ sort: task.createdAt, icon: '📋', title: '任务下发', time: task.createdAt, desc: '调度派发运输任务，运费¥' + task.price.toLocaleString() + (task.urgent ? '（加急）' : '') });
    }
    if (task.acceptedAt) {
      items.push({ sort: task.acceptedAt, icon: '✅', title: '司机接单', time: task.acceptedAt, desc: '您已确认接单，请按时到达装货地' });
    }

    var taskCheckins = appState.checkins.filter(function (c) { return c.taskId === taskId; });
    var stepIcons = ['🏭', '☕', '🏢'];
    var stepNames = ['装货打卡完成', '休息打卡完成', '卸货打卡完成'];
    var stepLocationFallback = [task.startAddr || '装货地', '服务区/途中休息', task.endAddr || '卸货地'];

    var existingSteps = {};
    taskCheckins.forEach(function (c) { existingSteps[c.step] = c; });

    var shouldFillMissing = task.checkinStep && task.checkinStep >= 1 && taskCheckins.length < task.checkinStep;
    for (var step = 1; step <= 3; step++) {
      if (step <= (task.checkinStep || 0)) {
        if (existingSteps[step]) {
          var c = existingSteps[step];
          var idx = c.step - 1;
          items.push({ sort: c.time, icon: stepIcons[idx] || '📍', title: stepNames[idx] || c.name, time: c.time, desc: '打卡位置：' + c.location });
        } else if (shouldFillMissing) {
          var fallbackTime = '';
          if (step === 1) fallbackTime = task.startTime || task.acceptedAt || task.createdAt;
          else if (step === 3) fallbackTime = task.completedAt || task.endTime;
          else {
            var s = task.startTime || task.acceptedAt || task.createdAt;
            var e = task.completedAt || task.endTime;
            fallbackTime = (s && e) ? s.substring(0, 10) + ' 途中' : (s || e || '');
          }
          var sidx = step - 1;
          items.push({
            sort: fallbackTime + '_' + step,
            icon: stepIcons[sidx],
            title: stepNames[sidx] + ' (记录补全)',
            time: fallbackTime,
            desc: '无详细打卡记录，基于' + (step === 1 ? '计划装货' : (step === 3 ? '任务完成' : '运输途中')) + '时间补全 · 地点：' + stepLocationFallback[sidx]
          });
        }
      }
    }

    var taskPhotos = appState.photos[taskId] || {};
    Object.keys(taskPhotos).forEach(function (type) {
      var p = taskPhotos[type];
      var label = PHOTO_TYPES[type] ? PHOTO_TYPES[type].label : type;
      items.push({ sort: p.time, icon: '📷', title: '上传' + label + '凭证', time: p.time, desc: label + '照片已上传，可预览' });
    });

    var taskExpenses = appState.expenses.filter(function (e) { return e.taskId === taskId; });
    taskExpenses.forEach(function (e) {
      items.push({ sort: e.time, icon: '💳', title: '登记' + e.typeName, time: e.time, desc: '支出 ¥' + e.amount.toLocaleString() + (e.remark ? '（' + e.remark + '）' : '') });
    });

    var taskExcs = getTaskExceptions(taskId);
    taskExcs.forEach(function (e) {
      items.push({ sort: e.time, icon: '⚠️', title: '上报' + e.typeName, time: e.time, desc: e.desc + (e.status === 'resolved' ? '（已处理）' : '（待处理）') });
      if (e.status === 'resolved' && e.handleTime) {
        items.push({ sort: e.handleTime, icon: '👨‍💼', title: '调度处理完成', time: e.handleTime, desc: e.handleNote });
      }
    });

    if (task.completedAt) {
      items.push({ sort: task.completedAt, icon: '🎯', title: '任务完成', time: task.completedAt, desc: '运输任务已完成，进入结算流程' });
    }
    if (task.receiptStatus === 'confirmed' && task.receiptConfirmedAt) {
      items.push({ sort: task.receiptConfirmedAt, icon: '📄', title: '回单已确认', time: task.receiptConfirmedAt, desc: '电子回单已签收确认' });
    }
    if (task.settlementStatus === 'to_pay' && task.receiptConfirmedAt) {
      items.push({ sort: task.receiptConfirmedAt + '_pay', icon: '💰', title: '进入待打款', time: task.receiptConfirmedAt + ' (稍后)', desc: '回单已确认，财务打款中' });
    }
    if (task.settlementStatus === 'paid' && task.paidInfo && task.paidInfo.paidTime) {
      items.push({ sort: task.paidInfo.paidTime, icon: '💵', title: '运费已到账', time: task.paidInfo.paidTime, desc: '已到账 ' + task.paidInfo.paidAccount + '，流水号：' + task.paidInfo.transactionId });
    }

    items.sort(function (a, b) { return a.sort < b.sort ? -1 : 1; });
    return items;
  }

  function renderTimeline(taskId) {
    var items = buildTimeline(taskId);
    if (items.length === 0) return '';

    var html = '<div class="task-timeline">' +
      '<div class="task-timeline-title">⏱️ 任务时间线</div>';
    items.forEach(function (it, idx) {
      var isLast = idx === items.length - 1;
      var dotCls = isLast ? 'active' : 'done';
      html += '<div class="tl-item">' +
        '<div class="tl-dot ' + dotCls + '">' + it.icon + '</div>' +
        (!isLast ? '<div class="tl-line"></div>' : '') +
        '<div class="tl-content">' +
        '<div class="tl-title">' + it.title + '</div>' +
        '<div class="tl-time">' + it.time + '</div>' +
        '<div class="tl-desc">' + it.desc + '</div>' +
        '</div></div>';
    });
    html += '</div>';
    return html;
  }

  function renderMonthlyView() {
    var viewEl = document.getElementById('monthlyView');
    var completed = appState.tasks.filter(function (t) { return t.status === 'completed'; });

    var monthMap = {};
    completed.forEach(function (t) {
      var timeKey = t.completedAt || t.endTime || t.startTime;
      var ym = timeKey ? timeKey.substring(0, 7) : '未知';
      if (!monthMap[ym]) {
        monthMap[ym] = [];
      }
      monthMap[ym].push(t);
    });

    var months = Object.keys(monthMap).sort(function (a, b) { return b < a ? -1 : 1; });
    if (months.length === 0) {
      viewEl.innerHTML = '<div class="empty-state"><div class="empty-icon" style="font-size:48px">📊</div>暂无历史收入数据</div>';
      return;
    }

    var html = '';
    months.forEach(function (ym) {
      var tasks = monthMap[ym];
      var sumFreight = 0;
      var sumIncome = 0;
      var sumCost = 0;
      var sumDeduct = 0;
      var sumSubsidy = 0;
      var sumPaid = 0;
      var sumUnpaid = 0;
      var sumNet = 0;

      tasks.forEach(function (t) {
        var s = t.settlement || calculateSettlement(t.id);
        sumFreight += s.basePrice;
        sumIncome += s.totalIncome;
        sumCost += s.totalCost;
        sumDeduct += s.totalDeduct;
        sumSubsidy += s.totalSubsidy;
        sumNet += s.netIncome;
        if (t.settlementStatus === 'paid') {
          sumPaid += s.netIncome;
        } else {
          sumUnpaid += s.netIncome;
        }
      });

      var isExpanded = appState.expandedMonth === ym;
      var netCls = sumNet < 0 ? 'negative' : 'positive';
      var paidCls = sumPaid < 0 ? 'negative' : 'positive';
      var unpaidCls = sumUnpaid < 0 ? 'negative' : 'positive';

      html += '<div class="month-card ' + (isExpanded ? 'expanded' : '') + '">' +
        '<div class="month-card-header" onclick="window.toggleMonth(\'' + ym + '\')">' +
        '<div class="month-title">' + ym.replace('-', '年') + '月</div>' +
        '<div class="month-summary">' +
        '<span>完成 <span class="m-num">' + tasks.length + '</span> 趟</span>' +
        '<span>净收入 <span class="m-num" style="color:' + (sumNet < 0 ? '#f53f3f' : '#00b42a') + '">' + (sumNet < 0 ? '-' : '') + '¥' + Math.abs(sumNet).toLocaleString() + '</span></span>' +
        '<span style="color:#86909c">' + (isExpanded ? '收起 ▲' : '展开 ▼') + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="month-card-body">' +
        '<div class="month-stats">' +
        '<div class="ms-item"><div class="ms-label">完成趟数</div><div class="ms-value">' + tasks.length + ' 趟</div></div>' +
        '<div class="ms-item"><div class="ms-label">运费合计</div><div class="ms-value">¥' + sumFreight.toLocaleString() + '</div></div>' +
        '<div class="ms-item"><div class="ms-label">收入合计（含加急）</div><div class="ms-value positive">¥' + sumIncome.toLocaleString() + '</div></div>' +
        '<div class="ms-item"><div class="ms-label">支出合计</div><div class="ms-value negative">¥' + sumCost.toLocaleString() + '</div></div>' +
        '<div class="ms-item"><div class="ms-label">异常扣补款</div><div class="ms-value ' + ((sumSubsidy - sumDeduct) < 0 ? 'negative' : 'positive') + '">' + ((sumSubsidy - sumDeduct) >= 0 ? '+' : '') + '¥' + (sumSubsidy - sumDeduct).toLocaleString() + '</div></div>' +
        '<div class="ms-item"><div class="ms-label">本月净收入</div><div class="ms-value ' + netCls + '">' + (sumNet < 0 ? '-' : '') + '¥' + Math.abs(sumNet).toLocaleString() + '</div></div>' +
        '<div class="ms-item"><div class="ms-label">已到账金额</div><div class="ms-value ' + paidCls + '">' + (sumPaid < 0 ? '-' : '') + '¥' + Math.abs(sumPaid).toLocaleString() + '</div></div>' +
        '<div class="ms-item"><div class="ms-label">未到账金额</div><div class="ms-value ' + unpaidCls + '">' + (sumUnpaid < 0 ? '-' : '') + '¥' + Math.abs(sumUnpaid).toLocaleString() + '</div></div>' +
        '</div>';

      tasks.forEach(function (t) {
        var s = t.settlement || calculateSettlement(t.id);
        var settleInfo = getSettlementStatusInfo(t.settlementStatus);
        var tNet = s.netIncome;
        html += '<div class="month-task-row" onclick="document.getElementById(\'closeIncomeModal\').click();window.viewIncome(\'' + t.id + '\')">' +
          '<div class="month-task-info">' +
          '<div class="month-task-no">' + t.id + (t.urgent ? ' <span class="badge urgent" style="font-size:10px;padding:1px 5px">加急</span>' : '') + '</div>' +
          '<div class="month-task-route">' + t.startAddr.substring(0, 8) + ' → ' + t.endAddr.substring(0, 8) + '</div>' +
          '</div>' +
          '<div>' +
          '<div class="month-task-amount" style="color:' + (tNet < 0 ? '#f53f3f' : '#00b42a') + '">' + (tNet < 0 ? '-' : '') + '¥' + Math.abs(tNet).toLocaleString() + '</div>' +
          '<div class="month-task-status" style="color:' + (t.settlementStatus === 'paid' ? '#00b42a' : (t.settlementStatus === 'to_pay' ? '#1677ff' : '#ff9500')) + '">' + settleInfo.text + '</div>' +
          '</div>' +
          '</div>';
      });

      html += '</div></div>';
    });

    viewEl.innerHTML = html;
  }

  window.toggleMonth = function (ym) {
    appState.expandedMonth = appState.expandedMonth === ym ? null : ym;
    renderMonthlyView();
  };

  window.renderMonthlyView = renderMonthlyView;

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
      if (m.receipt) {
        var isPending = m.receipt.status === '待确认';
        var statusTag = isPending ?
          '<span class="task-receipt-status pending" style="margin-left:6px">待确认</span>' :
          '<span class="task-receipt-status confirmed" style="margin-left:6px">已确认</span>';

        var photoHtml = m.taskId ? renderReceiptPhotos(m.taskId) : '';

        receiptHtml = '<div class="receipt-sign-card">' +
          '<div class="receipt-sign-title">📄 签收信息' + statusTag + '</div>' +
          '<div class="receipt-row"><span class="receipt-label">任务单号</span><span class="receipt-value">' + m.receipt.taskNo + '</span></div>' +
          '<div class="receipt-row"><span class="receipt-label">货物信息</span><span class="receipt-value">' + m.receipt.cargoName + ' / ' + m.receipt.cargoWeight + '</span></div>' +
          '<div class="receipt-row"><span class="receipt-label">签收时间</span><span class="receipt-value">' + m.receipt.signTime + '</span></div>' +
          '<div class="receipt-row"><span class="receipt-label">签收人</span><span class="receipt-value">' + m.receipt.signer + '</span></div>' +
          (m.receipt.confirmTime ? '<div class="receipt-row"><span class="receipt-label">确认时间</span><span class="receipt-value">' + m.receipt.confirmTime + '</span></div>' : '') +
          '<div style="font-size:13px;color:#1f2329;font-weight:600;margin-top:10px">司机上传凭证</div>' +
          photoHtml +
          (isPending && m.taskId ?
            '<div style="margin-top:12px"><button class="btn btn-primary btn-block" onclick="event.stopPropagation();window.confirmReceipt(\'' + m.taskId + '\')">确认电子回单</button></div>' : '') +
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