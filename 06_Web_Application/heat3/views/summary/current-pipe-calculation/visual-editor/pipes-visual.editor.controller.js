'use strict';

/**
 * Change to `true` to enable debug console messages
 */
const debug = false;

const ITEM_MARGIN_HORIZONTAL = 96;
const ITEM_MARGIN_VERTICAL = 72;
const CANVAS_PADDING = 42;
const SOURCE_ELEMENT_WIDTH = 116;
const SOURCE_ELEMENT_HEIGHT = 100;
const ZOOM_STEP = 100;

(function () {
  angular.module('cloudheatengineer')
    .controller('ModalPipesVisualEditorController', ModalPipesVisualEditorController)
    .directive('vbox', VieBoxDirective)
    .directive("ngWheel", ["$parse", ngWheelDirective]);

    ModalPipesVisualEditorController.$inject = ['$scope', '$modalInstance', 'data', '$document'];
})();

/**
 * Visual editor controller
 *
 * Exported data type is:
 * {
    rooms: Room[],
    tees: Tee[],
    schemaImageSvg: string,
    schemaImagePng: string,
  }
 */
function ModalPipesVisualEditorController($scope, $modalInstance, data, $document) {
  const vm = $scope;

  vm.onCloseModal = onCloseModal;
  vm.toPdf = toPdf;
  vm.onPrint = onPrint;
  vm.onComputeResults = onComputeResults;
  vm.onRemoveItem = onRemoveItem;
  vm.onSetMode = onSetMode;
  vm.onMouseMove = onMouseMove;
  vm.onMouseDown = onMouseDown;
  vm.onMouseUp = onMouseUp;
  vm.onZoomIn = onZoomIn;
  vm.onZoomOut = onZoomOut;
  vm.onWheel = onWheel;
  vm.isRoomAddedToCanvas = isRoomAddedToCanvas;
  vm.onAddRoomToCanvas = onAddRoomToCanvas;
  vm.onAddTee = onAddTee;
  vm.getArrowPath = getArrowPath;
  vm.getArrowLabelPosition = getArrowLabelPosition;
  vm.getArrowBetweenRadiators = getArrowBetweenRadiators;
  vm.onMoveRadiatorToLeft = onMoveRadiatorToLeft;
  vm.onMoveRadiatorToRight = onMoveRadiatorToRight;
  vm.onItemMouseDown = onItemMouseDown;
  vm.onItemMouseMove = onItemMouseMove;
  vm.onConnectionPointClick = onConnectionPointClick;
  vm.onItemMouseUp = onItemMouseUp;
  vm.onKeyDown = onKeyDown;
  vm.onKeyUp = onKeyUp;
  vm.getConnectedItemsCount = getConnectedItemsCount;
  vm.onPipeRunFlowLengthChanged = onPipeRunFlowLengthChanged;

  $document.bind('keydown', vm.onKeyDown);
  $document.bind('keyup', vm.onKeyUp);

  const mousePos = { x: 0, y: 0 };
  let movingItem = null; // item that is being dragged
  vm.priFlowText = data.priFlowText;
  vm.diameters = data.diameters;
  vm.connectionLine = null;
  vm.arrowLabelWidth = 52;
  vm.arrowLabelHeight = 22;
  vm.zoom = 0;

  vm.radiatorWidth = 144;
  vm.radiatorHeight = 136;
  vm.radiatorMargin = 68;
  vm.radiatorAliases = ['one', 'two', 'three', 'four', 'five', 'six'];
  vm.pipeRunIndexes = genCharArray('A', 'Z');

  vm.source = {
    _id: vm.priFlowText,
    type: 'room',
    data: {
      pipeRunData: {
        pipeRun: vm.pipeRunIndexes[0],
        pipeRunOrderId: 0,
        pipeRunAndOrderId: vm.priFlowText,
      }
    },
    width: 114,
    height: 98,
    x: 42,
    y: 42,
    exitPoint: () => ({
      x: 42 + 114,
      y: 42 + 98 / 2,
      vector: { x: 1, y: 0 },
    }),
    setChildrenCount: () => {},
    updateConnectionPoints: () => {},
  }

  init();

  function init() {
    debug && console.log('ModalPipesVisualEditorController', data);
    debug && console.log('rooms', data.rooms);
    debug && console.log('pipeRuns', data.rooms.map(r => r.pipeRunData));
    debug && console.log('radiators', data.rooms.map(r => r.radiators));
    debug && console.log('tees', data && data.tees);

    vm.mode = 'edit'; // 'edit' | 'drag'
    vm.mousePressed = false;
    vm.rooms = JSON.parse(JSON.stringify(data && data.rooms || []));
    vm.tees = JSON.parse(JSON.stringify(data && data.tees || []));
    vm.arrows = [];
    vm.items = [];
    vm.viewbox = {
      xMin: 0,
      yMin: 0,
      xMax: 0,
      yMax: 0,
    }
    vm.width = 0;
    vm.height = 0;

    setTimeout(() => {
      requestAnimationFrame(() => {
        setTimeout(afterViewInit, 0);
      });
    }, 40);
  }

  function afterViewInit() {
    const WRAP_PADDING = 24;

    const _wrapWidth = document.getElementById('svg-canvas-wrap').clientWidth - WRAP_PADDING;
    const _wrapHeight = document.getElementById('svg-canvas-wrap').clientHeight - CANVAS_PADDING;
    const wrapWidth = _wrapWidth > 680 ? _wrapWidth : 680;
    const wrapHeight = _wrapHeight > 320 ? _wrapHeight : 680;

    vm.viewbox = {
      xMin: 0,
      yMin: 0,
      xMax: wrapWidth,
      yMax: wrapHeight,
    };

    drawSchema();

    vm.width = wrapWidth - vm.viewbox.xMin;
    vm.height = wrapHeight - vm.viewbox.yMin;
  }

  function getPipeRunData(prevItem) {
    let pipeRun;
    let pipeRunOrderId;

    if (prevItem.type === 'room') {
      const pipeRunData = getRoomExitPipeRunData(prevItem.data);

      pipeRun = pipeRunData.pipeRun;
      pipeRunOrderId = +pipeRunData.pipeRunOrderId + 1;
    } else if (prevItem.type === 'tee') {
      const availablePipeRuns = vm.pipeRunIndexes.filter((pipeRun) => !vm.items.some((item) => {
        const pipeRunData = getRoomExitPipeRunData(item.data);

        return pipeRunData && pipeRunData.pipeRun === pipeRun;
      }));

      pipeRun = availablePipeRuns[0];
      pipeRunOrderId = 1;
    }

    return {
      pipeRun,
      pipeRunOrderId,
      pipeRunAndOrderId: `${pipeRun}${pipeRunOrderId}`,
    }
  }

  /**
   * get Room Exit PipeRunData considering presence of emitters
   */
  function getRoomExitPipeRunData(room) {
    if (!room) {
      return undefined;
    }

    if (!(room.radiators && room.radiators.length)) {
      return room.pipeRunData;
    }

    const lastRadiator = room.radiators[room.radiators.length - 1];

    return {
      pipeRun: lastRadiator.pipeRun,
      pipeRunAndOrderId: lastRadiator.pipeRunAndOrderId,
      pipeRunOrderId: lastRadiator.pipeRunOrderId,
    }
  }

  function onConnectionPointClick(e, item, point, pos) {
    mousePos.x =  e.clientX;
    mousePos.y = e.clientY;
    vm.connectionLine = {
      item,
      point,
      x1: pos.x,
      y1: pos.y,
      x2: pos.x,
      y2: pos.y,
    };
  }

  function onItemMouseUp(e, item) {
    if (!vm.connectionLine || !item.floating || vm.connectionLine.item._id === item._id) {
      return;
    }

    item.setChildrenCount(getChildrenCount(item));
    vm.connectionLine.item.setChildrenCount(getChildrenCount(vm.connectionLine.item));

    if (!(item.data.pipeRunData && item.data.pipeRunData.pipeRunAndOrderId)) {
      if (!item.data.pipeRunData) {
        item.data.pipeRunData = {};
      }

      Object.assign(item.data.pipeRunData, getPipeRunData(vm.connectionLine.item));
    }

    switch (item.type) {
      case 'room':
        if (vm.connectionLine.item.type === 'room') {
          const pipeRunData = getRoomExitPipeRunData(vm.connectionLine.item.data);

          item.data.pipeRunData.predecessorId = pipeRunData.pipeRunAndOrderId;
        } else if (vm.connectionLine.item.type === 'tee') {
          if (!vm.connectionLine.item.data.pipeRunIds) {
            vm.connectionLine.item.data.pipeRunIds = [];
          }

          item.data.pipeRunData.predecessorId = vm.connectionLine.item.data.preId;
          vm.connectionLine.item.data.pipeRunIds.push({roomRunId: item.data.pipeRunData.pipeRunAndOrderId, preId: vm.connectionLine.item.data.preId});
        }

        const roomPipeRun = item.data.pipeRunData.pipeRun;
        const roomPipeRunOrderId = item.data.pipeRunData.pipeRunOrderId;

        (item.data.radiators || []).forEach((radiator, i) => {
          Object.assign(radiator, {
            pipeRun: roomPipeRun,
            pipeRunOrderId: roomPipeRunOrderId + i + 1,
            pipeRunAndOrderId: `${roomPipeRun}${roomPipeRunOrderId + i + 1}`,
            predecessorId: `${roomPipeRun}${roomPipeRunOrderId + i}`,
          });
        });
        break;
      case 'tee':
        const pipeRunData = getRoomExitPipeRunData(vm.connectionLine.item.data);
        item.data.preId = pipeRunData.pipeRunAndOrderId;
        vm.tees.push(item.data);
        break;
    }

    vm.connectionLine.item.floating = false;
    vm.connectionLine.item.updateConnectionPoints();
    item.floating = false;
    item.updateConnectionPoints();

    updateItem(item, vm.connectionLine.point, vm.connectionLine.item);
  }

  function onKeyDown(e) {
    if (e.keyCode === 17 && vm.mode === 'edit') {
      vm.tmpEditMode = true;
      vm.mode = 'drag';
    }
  }

  function onKeyUp() {
    if (vm.tmpEditMode) {
      vm.tmpEditMode = false;
      vm.mode = 'edit';
    }
  }

  function getConnectedItemsCount() {
    return vm.items.filter(i => !i.floating).length;
  }

  function onPipeRunFlowLengthChanged(item) {
    if ((item.data.radiators || []).length) {
      item.data.radiators[0].radsFlowreturn = item.data.flowReturnPipes;
    }
  }

  function onItemMouseDown(e, item) {
    mousePos.x =  e.clientX;
    mousePos.y = e.clientY;

    if (item.floating) {
      movingItem = item;
    }
  }

  function onItemMouseMove(e) {
    if (vm.mode === 'edit' && movingItem && e.buttons === 1) {
      e.preventDefault();

      // How far the mouse has been moved
      const dx = e.clientX - mousePos.x;
      const dy = e.clientY - mousePos.y;

      mousePos.x =  e.clientX;
      mousePos.y = e.clientY;

      const scale = getScale();

      movingItem.x += dx / scale;
      movingItem.y += dy / scale;
    }
  }

  function getArrowPath(line) {
    let p1;
    let p2;
    let p3;

    switch (getArrowDirection(line)) {
      case 'right':
        p1 = {x: line.x2 - 4, y: line.y2 - 3};
        p2 = {x: line.x2, y: line.y2};
        p3 = {x: line.x2 - 4, y: line.y2 + 3};
        break;
      case 'left':
        p1 = {x: line.x2 + 4, y: line.y2 - 3};
        p2 = {x: line.x2, y: line.y2};
        p3 = {x: line.x2 + 4, y: line.y2 + 3};
        break;
      case 'up':
        p1 = {x: line.x2 - 3, y: line.y2 + 4};
        p2 = {x: line.x2, y: line.y2};
        p3 = {x: line.x2 + 3, y: line.y2 + 4};
        break;
      case 'down':
        p1 = {x: line.x2 - 3, y: line.y2 - 4};
        p2 = {x: line.x2, y: line.y2};
        p3 = {x: line.x2 + 3, y: line.y2 - 4};
        break;
    }

    return p1 && p2 && p3 ? `M${p1.x},${p1.y} L${p2.x},${p2.y} L${p3.x},${p3.y}` : '';
  }

  function getArrowLabelPosition(line) {

    if (!line) {
      return {};
    }

    switch (getArrowDirection(line)) {
      case 'left':
      case 'right':
        return {x: (line.x1 + line.x2) / 2 - vm.arrowLabelWidth / 2, y: line.y1 - vm.arrowLabelHeight / 2};

      case 'up':
      case 'down':
        return {x: line.x1 - vm.arrowLabelWidth / 2, y: (line.y1 + line.y2) / 2 - vm.arrowLabelHeight / 2};
    }

    return {};
  }

  function getArrowDirection(line) {
    switch (true) {
      case line.y1 === line.y2 && line.x2 - line.x1 > 0:
        return 'right';
      case line.y1 === line.y2 && line.x2 - line.x1 < 0:
        return 'left';
      case line.x1 === line.x2 && line.y2 - line.y1 < 0:
        return 'up';
      case line.x1 === line.x2 && line.y2 - line.y1 > 0:
        return 'down';
    }

    return '';
  }

  function getArrowBetweenRadiators(radiator1, radiator2) {
    if (!radiator2) {
      return null;
    }

    return {
      x1: vm.radiatorWidth,
      y1: vm.radiatorHeight / 2,
      x2: vm.radiatorWidth + vm.radiatorMargin,
      y2: vm.radiatorHeight / 2,
    }
  }

  function onMoveRadiatorToLeft(radiators, index) {
    const pipeRunData1 = {
      pipeRun: radiators[index - 1].pipeRun,
      pipeRunAndOrderId: radiators[index - 1].pipeRunAndOrderId,
      pipeRunOrderId: radiators[index - 1].pipeRunOrderId,
    }

    const pipeRunData2 = {
      pipeRun: radiators[index].pipeRun,
      pipeRunAndOrderId: radiators[index].pipeRunAndOrderId,
      pipeRunOrderId: radiators[index].pipeRunOrderId,
    }

    switchRadiatorsData(radiators[index], radiators[index - 1])

    Object.assign(radiators[index - 1], pipeRunData1);
    Object.assign(radiators[index], pipeRunData2);
  }

  function onMoveRadiatorToRight(radiators, index) {
    const pipeRunData1 = {
      pipeRun: radiators[index].pipeRun,
      pipeRunAndOrderId: radiators[index].pipeRunAndOrderId,
      pipeRunOrderId: radiators[index].pipeRunOrderId,
    }

    const pipeRunData2 = {
      pipeRun: radiators[index + 1].pipeRun,
      pipeRunAndOrderId: radiators[index + 1].pipeRunAndOrderId,
      pipeRunOrderId: radiators[index + 1].pipeRunOrderId,
    }

    switchRadiatorsData(radiators[index], radiators[index + 1])

    Object.assign(radiators[index], pipeRunData1);
    Object.assign(radiators[index + 1], pipeRunData2);
  }

  /**
   * Needed to sync data in sidebar
   */
  function switchRadiatorsData(radiator1, radiator2) {
    const tmp1 = JSON.parse(JSON.stringify(radiator1));
    const tmp2 = JSON.parse(JSON.stringify(radiator2));

    const clearProperties = (obj) => Object.keys(obj).forEach((key) => delete obj[key]);
    clearProperties(radiator1);
    clearProperties(radiator2);

    Object.assign(radiator1, tmp2);
    Object.assign(radiator2, tmp1);
  }

  function onAddRoomToCanvas(room) {
    const scale = getScale();
    const wrapEl = document.getElementById('svg-canvas-wrap');

    const entryPoint = {
      x: (wrapEl.scrollLeft + vm.viewbox.xMin + 50 + Math.round(Math.random() * 100)) / scale,
      y: (wrapEl.scrollTop + vm.viewbox.yMin + 75 + Math.round(Math.random() * 100)) / scale,
    };

    room.pipeRunData = {};

    vm.items.push(new RoomOrTeeItemClass('room', room, entryPoint, undefined, {floating: true, radiatorWidth: vm.radiatorWidth, radiatorMargin: vm.radiatorMargin}));
  }

  function onAddTee() {
    const scale = getScale();
    const wrapEl = document.getElementById('svg-canvas-wrap');

    const entryPoint = {
      x: (wrapEl.scrollLeft + vm.viewbox.xMin + 50 + Math.round(Math.random() * 100)) / scale,
      y: (wrapEl.scrollTop + vm.viewbox.yMin + 75 + Math.round(Math.random() * 100)) / scale,
    };

    const tee = {
      // todo: clarify if isCustom needed here
      isCustom: true,
      pipeRunFlowLength: 0,
      pipeRunIds: [],
      pipeSelect: 0,
      preId: null,
    }

    vm.items.push(new RoomOrTeeItemClass('tee', tee, entryPoint, undefined, {floating: true, radiatorWidth: vm.radiatorWidth, radiatorMargin: vm.radiatorMargin}));
  }

  function onRemoveItem(itemToRemove) {
    if (vm.mode !== 'edit') {
      return;
    }

    let childrenItems = [];

    switch (itemToRemove.type) {
      case 'room':
        const tee = (vm.tees || []).filter(t => !!t).find(tee => (tee.pipeRunIds || []).some(pipeRun => pipeRun.roomRunId === itemToRemove.data.pipeRunData.pipeRunAndOrderId));
        const teeItem = vm.items.find(item => item.type === 'tee' && (item.data.pipeRunIds || []).some(pipeRun => pipeRun.roomRunId === itemToRemove.data.pipeRunData.pipeRunAndOrderId))

        if (tee) {
          const pipeRunIndex = tee.pipeRunIds.findIndex(pipeRun => pipeRun.roomRunId === itemToRemove.data.pipeRunData.pipeRunAndOrderId);
          tee.pipeRunIds.splice(pipeRunIndex, 1);
        }

        childrenItems = vm.items.filter(item => item.data.pipeRunData && item.data.pipeRunData.predecessorId === itemToRemove.data.pipeRunData.pipeRunAndOrderId);

        itemToRemove.data.pipeRunData.predecessorId = undefined;

        if (teeItem) {
          teeItem.setChildrenCount(teeItem.childrenCount - 1);
          teeItem.updateConnectionPoints();
        }
        break;

      case 'tee':
        const teeIndex = vm.tees.findIndex((t) => t.preId === itemToRemove.data.preId);

        if (teeIndex > -1) {
          childrenItems = vm.items.filter(item => item.data.pipeRunData && vm.tees[teeIndex].pipeRunIds.some(pipeRunId => pipeRunId.roomRunId === item.data.pipeRunData.pipeRunAndOrderId));

          vm.tees.splice(teeIndex, 1);
        }

        itemToRemove.data.preId = null;

        // recursively remove all children
        childrenItems.forEach(child => vm.onRemoveItem(child));

        break;
    }

    itemToRemove.floating = false;
    itemToRemove.updateConnectionPoints();

    drawSchema();
  }

  function onCloseModal() {
    $modalInstance.dismiss('close');
  }

  function onComputeResults() {
    const roomsFromCanvas = vm.items.filter((item) => item.type === 'room').map((item) => ({
      ...item.data,
      radiators: item.data.radiators && item.data.radiators.length ?
          getRadiatorsObjFromArray(item.data.radiators) :
          null,
    }));

    const notUsedRooms = vm.rooms.filter((room) => !isRoomAddedToCanvas(room, vm.items));

    const svgImage = getSvgImage();

    svgToPng(svgImage)
        .then((pngImage) => {
          const result = {
            rooms: [...roomsFromCanvas, ...notUsedRooms],
            tees: vm.items.filter((item) => item.type === 'tee').map((item) => item.data),
            schemaImageSvg: svgImage,
            schemaImagePng: pngImage,
          };

          $modalInstance.close(result);

          debug && console.warn('results', result);
        })
        .catch((err) => {
          console.warn(err);
          alert('Image export failed');
        });
  }

  function onPrint() {
    getPdfDocDefinition()
        .then((docDefinition) => {
          pdfMake.createPdf(docDefinition).print();
        })
        .catch((err) => {
          console.warn(err);
          alert('Image export failed');
        });
  }

  function toPdf() {
    getPdfDocDefinition()
        .then((docDefinition) => {
          pdfMake.createPdf(docDefinition).download('Network diagram ' + Date.now());
        })
        .catch((err) => {
          console.warn(err);
          alert('Image export failed');
        });
  }

  function getPdfDocDefinition() {
    const svg = getSvgImage();

    return svgToPng(svg)
        .then((pngImage) => {
          return {
            content: [
              {
                fit: [500, 1000],
                image: pngImage,
                // * direct svg export available in pdfMake v0.1.59
                // * one of versions below should work
                // svg: svg,
                // svg: unescape(encodeURIComponent(svg)),
              }
            ]
          };
        });
  }

  function drawSchema() {
    vm.arrows = [];
    vm.items = vm.items.filter(item => item.floating);
    const X0 = SOURCE_ELEMENT_WIDTH + CANVAS_PADDING;
    const Y0 = SOURCE_ELEMENT_HEIGHT / 2 + CANVAS_PADDING;

    const firstElTee = vm.tees.find((tee) => tee && tee.preId === vm.priFlowText);
    const firstElRoom = !firstElTee && vm.rooms.find((room) => room.pipeRunData && room.pipeRunData.predecessorId === vm.priFlowText);

    if (firstElTee || firstElRoom) {
      const type = firstElTee ? 'tee' : 'room';
      const entryPoint = {x: X0 + ITEM_MARGIN_HORIZONTAL, y: Y0}
      const firstItem = new RoomOrTeeItemClass(type, (firstElTee || firstElRoom), entryPoint, undefined, {radiatorWidth: vm.radiatorWidth, radiatorMargin: vm.radiatorMargin});
      vm.items.push(firstItem);
      vm.arrows.push({
        from: vm.priFlowText,
        to: firstItem._id,
        toItem: firstItem,
        line: {x1: X0, y1: Y0, x2: entryPoint.x, y2: entryPoint.y},
      });

      // todo: unify
      vm.viewbox = getAdjustedViewBox(vm.viewbox, firstItem.getBoundingBox());
      vm.width = vm.viewbox.xMax - vm.viewbox.xMin + vm.zoom * ZOOM_STEP;
      vm.height = vm.viewbox.yMax - vm.viewbox.yMin + vm.zoom * ZOOM_STEP;

      drawChildren(firstItem, vm.rooms, !!firstElTee);
    }

    vm.items.forEach((item) => {
      item.setChildrenCount(getChildrenCount(item));
    });
  }

  function updateItem(item, prevItemConnectionPoint, prevItem) {
    const prevItemExitPoint = prevItemConnectionPoint.exitPoint;
    const exitPointVector = prevItemExitPoint.vector;
    prevItem.setChildrenCount(prevItem.childrenCount + 1);

    const entryPoint = {
      x: prevItemExitPoint.x + ITEM_MARGIN_HORIZONTAL * exitPointVector.x,
      y: prevItemExitPoint.y + ITEM_MARGIN_VERTICAL * exitPointVector.y,
    };

    item.entryPoint = entryPoint;
    item.entryVector = exitPointVector;

    item.calculatePosition();
    item.updateConnectionPoints();

    // todo: unify
    vm.viewbox = getAdjustedViewBox(vm.viewbox, item.getBoundingBox());
    vm.width = vm.viewbox.xMax - vm.viewbox.xMin + vm.zoom * ZOOM_STEP;
    vm.height = vm.viewbox.yMax - vm.viewbox.yMin + vm.zoom * ZOOM_STEP;

    vm.arrows.push({
      from: prevItem._id,
      fromItem: prevItem,
      to: item._id,
      toItem: item,
      line: {x1: prevItemExitPoint.x, y1: prevItemExitPoint.y, x2: entryPoint.x, y2: entryPoint.y},
    });

    if (item.data.room_id) {
      const room = vm.rooms.find(r => r.room_id === item.data.room_id);

      if (room) {
        Object.assign(room, item.data);

        room.radiators = getRadiatorsObjFromArray(item.data.radiators);
      } else {
        console.error('room not found', room);
      }
    } else {
      // case for tee
    }
  }

  function drawChildren(item, rooms = [], firstElementTee) {
    const exitRunAndOrderId = !firstElementTee ? (
        (item.data.radiators || []).length ?
          item.data.radiators[item.data.radiators.length - 1].pipeRunAndOrderId :
          item.data.pipeRunData.pipeRunAndOrderId
    ) : vm.priFlowText;

    const children = rooms.filter((room) => {
      return room.pipeRunData && exitRunAndOrderId &&
          room.pipeRunData.predecessorId === exitRunAndOrderId;
    });

    if (children.length > 2) {
      console.warn('More than 2 child elements found for tee', children);
    }

    let teeItem;
    const teeIndex = (vm.tees || []).filter(t => !!t).findIndex((t) => t.preId === exitRunAndOrderId);

    item.setChildrenCount(children.length + (teeIndex > -1 ? 1 : 0));
    let prevItemExitPoint = item.exitPoint();

    if (teeIndex > -1) {
      const tee = teeIndex > -1 ? vm.tees[teeIndex] : null;

      if (!tee) {
        return;
      }

      const entryPoint = {
        x: prevItemExitPoint.x + ITEM_MARGIN_HORIZONTAL * prevItemExitPoint.vector.x,
        y: prevItemExitPoint.y + ITEM_MARGIN_VERTICAL * prevItemExitPoint.vector.y,
      };

      if (!firstElementTee) {
          teeItem = new RoomOrTeeItemClass('tee', {...tee, teeIndex}, entryPoint, prevItemExitPoint.vector, {radiatorWidth: vm.radiatorWidth, radiatorMargin: vm.radiatorMargin});
          vm.items.push(teeItem);
          vm.arrows.push({
              from: item._id,
              fromItem: item,
              to: teeItem._id,
              toItem: teeItem,
              line: {x1: prevItemExitPoint.x, y1: prevItemExitPoint.y, x2: entryPoint.x, y2: entryPoint.y},
          });

          // todo: unify
          vm.viewbox = getAdjustedViewBox(vm.viewbox, teeItem.getBoundingBox());
          vm.width = vm.viewbox.xMax - vm.viewbox.xMin + vm.zoom * ZOOM_STEP;
          vm.height = vm.viewbox.yMax - vm.viewbox.yMin + vm.zoom * ZOOM_STEP;
      } else {
          teeItem = item;
      }
    }

    const initialExitPointVector = prevItemExitPoint && prevItemExitPoint.vector;

    children.forEach((childRoom, i) => {
      let newVector = Object.assign({}, initialExitPointVector);

      // modify vector if needed
      if (teeItem) {
        const direction = !i ? 1 : -1;

        switch (true) {
          case !initialExitPointVector.y:
            newVector = { x: 0, y: 1 * direction };
            break;

          case !initialExitPointVector.x:
            newVector = { x: 1 * direction, y: 0 };
            break;
        }

        prevItemExitPoint = teeItem.exitPoint(newVector);
      }

      const entryPoint = {
        x: prevItemExitPoint.x + ITEM_MARGIN_HORIZONTAL * newVector.x,
        y: prevItemExitPoint.y + ITEM_MARGIN_VERTICAL * newVector.y,
      };

      const childItem = new RoomOrTeeItemClass('room', childRoom, entryPoint, newVector, {radiatorWidth: vm.radiatorWidth, radiatorMargin: vm.radiatorMargin});

      vm.items.push(childItem);
      vm.arrows.push({
        from: teeItem ? teeItem._id : item._id,
        fromItem: teeItem || item,
        to: childItem._id,
        line: {x1: prevItemExitPoint.x, y1: prevItemExitPoint.y, x2: entryPoint.x, y2: entryPoint.y},
        toItem: childItem,
      });

      vm.viewbox = getAdjustedViewBox(vm.viewbox, childItem.getBoundingBox());
      vm.width = vm.viewbox.xMax - vm.viewbox.xMin + vm.zoom * ZOOM_STEP;
      vm.height = vm.viewbox.yMax - vm.viewbox.yMin + vm.zoom * ZOOM_STEP;

      drawChildren(childItem, rooms);
    });
  }

  function onSetMode(mode) {
    vm.mode = mode;
  }

  function getScale() {
    const scaleX = vm.width / (vm.viewbox.xMax - vm.viewbox.xMin);
    const scaleY = vm.height / (vm.viewbox.yMax - vm.viewbox.yMin);

    return scaleX < scaleY ? scaleX : scaleY;
  }

  function onMouseMove(e) {
    e.preventDefault();

    if (vm.connectionLine) {
      const dx = e.clientX - mousePos.x;
      const dy = e.clientY - mousePos.y;
      const scale = getScale();

      vm.connectionLine.x2 += dx / scale;
      vm.connectionLine.y2 += dy / scale;
      mousePos.x =  e.clientX;
      mousePos.y = e.clientY;
    }

    if (vm.mousePressed) {
      e.preventDefault();

      // How far the mouse has been moved
      const dx = e.clientX - mousePos.x;
      const dy = e.clientY - mousePos.y;

      if (vm.connectionLine) {
        vm.connectionLine.x2 += dx;
        vm.connectionLine.y2 += dy;
      }

      mousePos.x =  e.clientX;
      mousePos.y = e.clientY;

      e.currentTarget.scrollLeft -= dx;
      e.currentTarget.scrollTop -= dy;
    }
  }

  function onMouseDown(e) {
    if (vm.mode === 'drag') {
      vm.mousePressed = true;
      mousePos.x =  e.clientX;
      mousePos.y = e.clientY
    }
  }

  function onMouseUp(e) {
    vm.mousePressed = false;
    vm.connectionLine = null;
    movingItem = null;
  }

  function onZoomIn() {
    vm.zoom++;
    vm.width += ZOOM_STEP;
    vm.height += ZOOM_STEP;
  }

  function onZoomOut() {
    vm.zoom--;
    const zoomW = vm.width - ZOOM_STEP;
    vm.width = zoomW > 0 ? zoomW : ZOOM_STEP;

    const zoomH = vm.height - ZOOM_STEP;
    vm.height = zoomH > 0 ? zoomH : ZOOM_STEP;
  }

  function onWheel (e) {
    if (e.ctrlKey && e.originalEvent && e.originalEvent.deltaY) {
      e.preventDefault();

      if (e.originalEvent.deltaY > 0) {
        vm.onZoomOut();
      } else {
        vm.onZoomIn();
      }
    }
  }

  function getSvgImage() {
    return new XMLSerializer().serializeToString(document.getElementById('schema-image'));
  }

  function svgToPng(svgString) {
    return new Promise((resolve, reject) => {
      const cachedMode = vm.mode;

      vm.mode = 'drag';

      setTimeout(() => {
        try {
          const imgSrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
          const canvas = document.querySelector('canvas');
          const context = canvas.getContext('2d');

          // const minX = vm.items.map((item) => item.x).sort((x1, x2) => x1 - x2)[0] * vm.zoom;

          const image = new Image;
          image.src = imgSrc;
          image.onload = function () {
            const width = vm.width;

            canvas.setAttribute('width', width);
            canvas.setAttribute('height', vm.height);
            context.clearRect(0, 0, width, vm.height);
            context.drawImage(image, 0, 0);

            vm.mode = cachedMode;
            resolve(canvas.toDataURL('image/png'));
          };

          image.onerror = function(e) {
            vm.mode = cachedMode;
            reject(e);
          }
        } catch (e) {
          vm.mode = cachedMode;
          reject(e);
        }
      }, cachedMode !== 'drag' ? 50 : 0);
    });
  }

  function isRoomAddedToCanvas(room, canvasItems) {
    if (!room || !room.pipeRunData) {
      return false;
    }

    return canvasItems.some((item) => item && item.data && item.data.room_id === room.room_id);
  }

  /**
   *
   * @param currentViewBox: {xMin: number, xMax: number, yMin: number, yMax: number}
   * @param elementBoundingBox: {xMin: number, xMax: number, yMin: number, yMax: number}
   * @returns vieBox: {xMin: number, xMax: number, yMin: number, yMax: number}
   */
  function getAdjustedViewBox(currentViewBox, elementBoundingBox) {
    let viewBox = Object.assign({}, currentViewBox);

    if (elementBoundingBox.xMax > currentViewBox.xMax - CANVAS_PADDING) {
      viewBox.xMax = elementBoundingBox.xMax + CANVAS_PADDING;
    }

    if (elementBoundingBox.yMax > currentViewBox.yMax - CANVAS_PADDING) {
      viewBox.yMax = elementBoundingBox.yMax + CANVAS_PADDING;
    }

    if (elementBoundingBox.xMin < currentViewBox.xMin + CANVAS_PADDING) {
      viewBox.xMin = elementBoundingBox.xMin - CANVAS_PADDING;
    }

    if (elementBoundingBox.yMin < currentViewBox.yMin + CANVAS_PADDING) {
      viewBox.yMin = elementBoundingBox.yMin - CANVAS_PADDING;
    }

    return viewBox;
  }

  function getChildrenCount(item) {
    switch(item.type) {
      case 'tee':
        return item.data.pipeRunIds.length;
      case 'room':
        const roomOrLastEmitterId = ((item.data.radiators || []).length &&
            item.data.radiators[item.data.radiators.length - 1] &&
            item.data.radiators[item.data.radiators.length - 1].pipeRunAndOrderId) || item.data.pipeRunData.pipeRunAndOrderId;

        const filteredItems = vm.items.filter((room) => {
          return room.data.pipeRunData && item.data.pipeRunData && room.data.pipeRunData.predecessorId && room.data.pipeRunData.predecessorId === roomOrLastEmitterId ||
              (item.data.pipeRunData && room.data.preId && room.data.preId === roomOrLastEmitterId)
        });

        return filteredItems.length
    }

    return 0;
  }
}

function RoomOrTeeItemClass(type,
                            data,
                            entryPoint = { x: 0, y: 0 },
                            entryVector = { x: 1, y: 0 },
                            config = {radiatorWidth: 100, radiatorMargin: 20},
) {
  this._id = (data.room_name || data.preId) + (data.room_id || '') + '_' + `${Date.now()}`.slice(-4) + '-' + Math.round(Math.random() * 10000); // just unique id

  this.entryPoint = entryPoint;
  this.entryVector = entryVector;
  this.type = type;
  this.data = transformItem(data);
  this.width = 0;
  this.height = 0;
  this.floating = !!(config && config.floating);
  this.childrenCount = 0;

  if (this.data.radiators && this.data.radiators[0] && this.data.radiators[0].radsFlowreturn) {
    this.data.flowReturnPipes = this.data.radiators[0].radsFlowreturn;
  }

  this.updateConnectionPoints = () => {
    this.connectionPoints = getConnectionPoints();
  }

  this.setChildrenCount = (count) => {
    this.childrenCount = count;
    this.updateConnectionPoints();
  }

  const getConnectionPoints = () => {
    if (this.floating || (this.type !== 'tee' && this.childrenCount === 1) || this.childrenCount > 1) {
      return [];
    }

    let initialExitPoint = this.exitPoint();
    const initialExitPointVector = initialExitPoint.vector;
    let newExitPointVector;

    if (this.type === 'tee') {
      newExitPointVector = Object.assign({}, initialExitPointVector);

      const direction = this.childrenCount === 1 ? -1 : 1;

      switch (true) {
        case !initialExitPointVector.y:
          newExitPointVector = { x: 0, y: 1 * direction };
          break;

        case !initialExitPointVector.x:
          newExitPointVector = { x: 1 * direction, y: 0 };
          break;
      }

      initialExitPoint = this.exitPoint(newExitPointVector);
      // Todo: Edit here if needed to show 2 points at the same time
    }

    return [{
      x: initialExitPoint.x - this.x - 7,
      y: initialExitPoint.y - this.y - 7,
      exitPoint: {
        ...initialExitPoint,
        vector: newExitPointVector || initialExitPointVector,
      },
    }];
  }

  switch (type) {
    case 'room':
      const radiatorsCount = this.data.radiators.length;

      if (radiatorsCount) {
        this.width = 128 + config.radiatorWidth * radiatorsCount + config.radiatorMargin * (radiatorsCount - 1) + 16;
        this.height = 212;
      } else {
        this.width = 130;
        this.height = 146;
      }
      break;
    case 'tee':
      this.width = 116;
      this.height = 125;
      break;
  }

  this.calculatePosition = () => {
    switch (true) {
      case this.entryVector.x === 1 && !this.entryVector.y:
        this.x = this.entryPoint.x;
        this.y = this.entryPoint.y - this.height / 2;
        break;

      case this.entryVector.x === -1 && !this.entryVector.y:
        this.x = this.entryPoint.x - this.width;
        this.y = this.entryPoint.y - this.height / 2;
        break;

      case !this.entryVector.x && this.entryVector.y === 1:
        this.x = this.entryPoint.x - this.width / 2;
        this.y = this.entryPoint.y;
        break;

      case !this.entryVector.x && this.entryVector.y === -1:
        this.x = this.entryPoint.x - this.width / 2;
        this.y = this.entryPoint.y - this.height;
        break;
    }
  }

  this.calculatePosition();

  this.exitPoint = (vector) => {
    vector = vector || this.entryVector;

    switch (true) {
      case vector.x === 1 && !vector.y:
        return { x: this.x + this.width, y: this.y + this.height / 2, vector };

      case vector.x === -1 && !vector.y:
        return { x: this.x, y: this.y + this.height / 2, vector };

      case !vector.x && vector.y === 1:
        return { x: this.x + this.width / 2, y: this.y + this.height, vector };

      case !vector.x && vector.y === -1:
        return { x: this.x + this.width / 2, y: this.y, vector };
    }
  }

  this.getBoundingBox = () => ({
    xMin: this.x,
    xMax: this.x + this.width,
    yMin: this.y,
    yMax: this.y + this.height,
  });

  this.connectionPoints = getConnectionPoints();

  function transformItem(item) {
    return {
      ...item,
      radiators: !item.radiators ? [] : getRadiatorsArrayFromObj(item.radiators),
    }
  }
}

function VieBoxDirective() {
  return {
    link: function(scope, element, attrs) {
      attrs.$observe('vbox', function(value) {
        element.get(0).setAttribute("viewBox", value);
      })
    }
  };
}

function ngWheelDirective($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr.ngWheel);

    element.bind("mousewheel", function(event) {
      scope.$apply(function() {
        fn(scope, {
          $event: event
        });
      });
    });
  };
}

/**
 * Helpers
 */

function genCharArray(charA, charZ) {
  const a = [];
  let i = charA.charCodeAt(0);
  const j = charZ.charCodeAt(0);

  for (; i <= j; ++i) {
    a.push(String.fromCharCode(i));
  }

  return a;
}

function getRadiatorsArrayFromObj(radiators) {
  radiators = radiators || {};

  return [
    radiators.one,
    radiators.two,
    radiators.three,
    radiators.four,
    radiators.five,
    radiators.six,
  ].filter((r) => !!r);
}

function getRadiatorsObjFromArray(radiatorsArr) {
  const radiatorsObj = {};

  radiatorsArr.forEach((radiator, i) => {
    switch (i + 1) {
      case 1:
        radiatorsObj.one = radiator;
        break;
      case 2:
        radiatorsObj.two = radiator;
        break;
      case 3:
        radiatorsObj.three = radiator;
        break;
      case 4:
        radiatorsObj.four = radiator;
        break;
      case 5:
        radiatorsObj.five = radiator;
        break;
      case 6:
        radiatorsObj.six = radiator;
        break;
    }
  });

  return radiatorsObj;
}
