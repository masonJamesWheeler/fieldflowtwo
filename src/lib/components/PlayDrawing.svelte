<!-- src/lib/components/PlayDrawing.svelte -->
<script>
    import { onMount } from 'svelte';
    import { Player } from '$lib/Player.js';

    export let width = 600;
    export let height = 400;
    export let editable = true;
    export let playData = null;

    const scale = 4;
    let canvas;
    let ctx;
    let players = [];
    let selectedPlayer = null;
    let isAddingOffensivePlayer = false;
    let isAddingDefensivePlayer = false;

    $: canvasWidth = width * scale;
    $: canvasHeight = height * scale;

    let isDrawingRoute = false;
    let currentRoutePath = [];
    let currentRoutePlayer = null;
    let mousePosition = { x: 0, y: 0 };

    function updateMousePosition(event) {
        if (isDrawingRoute) {
            [mousePosition.x, mousePosition.y] = getMousePos(canvas, event);
            redraw();
        }
    }

    function startDrawingRoute(event) {
        if (!isDrawingRoute) return;

        const [x, y] = getMousePos(canvas, event);
        const player = players.find(p => p.isPointInside(x, y));

        if (player && !currentRoutePlayer) {
            currentRoutePlayer = player;
            currentRoutePath = [[x, y]];
        } else if (currentRoutePlayer) {
            currentRoutePath.push([x, y]);
        }
        redraw();
    }

    function endDrawingRoute(event) {
        if (currentRoutePlayer && currentRoutePath.length > 1) {
            currentRoutePlayer.route = currentRoutePath;
            currentRoutePlayer = null;
            currentRoutePath = [];
            isDrawingRoute = false;
            redraw();
        }
    }

    function drawPlayerRoutes() {
        players.forEach(player => {
            if (player.route && player.route.length > 1) {
                ctx.beginPath();
                ctx.moveTo(player.route[0][0], player.route[0][1]);
                for (let i = 1; i < player.route.length; i++) {
                    ctx.lineTo(player.route[i][0], player.route[i][1]);
                }
                ctx.strokeStyle = player.isOffense ? 'lightblue' : 'pink';
                ctx.lineWidth = 2 / scale;
                ctx.stroke();

                // Draw arrow at the end of the route
                const lastPoint = player.route[player.route.length - 1];
                const secondLastPoint = player.route[player.route.length - 2];
                drawArrow(ctx, secondLastPoint[0], secondLastPoint[1], lastPoint[0], lastPoint[1]);
            }
        });
    }

    function drawProjectedLine() {
        if (isDrawingRoute && currentRoutePlayer) {
            ctx.beginPath();
            const startPoint = currentRoutePath.length > 0
                ? currentRoutePath[currentRoutePath.length - 1]
                : [currentRoutePlayer.x, currentRoutePlayer.y];
            ctx.moveTo(startPoint[0], startPoint[1]);
            ctx.lineTo(mousePosition.x, mousePosition.y);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1 / scale;
            ctx.setLineDash([5 / scale, 5 / scale]);
            ctx.stroke();
            ctx.setLineDash([]);  // Reset to solid line
        }
    }

    function redraw() {
        initCanvas();
        drawPlayers();
        drawPlayerRoutes();
        if (currentRoutePath.length > 0) {
            ctx.beginPath();
            ctx.moveTo(currentRoutePath[0][0], currentRoutePath[0][1]);
            for (let i = 1; i < currentRoutePath.length; i++) {
                ctx.lineTo(currentRoutePath[i][0], currentRoutePath[i][1]);
            }
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2 / scale;
            ctx.stroke();
        }
        drawProjectedLine();
    }

    function drawArrow(ctx, fromX, fromY, toX, toY) {
        const headLength = 10 / scale;
        const angle = Math.atan2(toY - fromY, toX - fromX);

        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
    }

    onMount(() => {
        ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        initCanvas();
        if (playData) {
            loadPlay(playData);
        }
    });

    function initCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        drawField();
    }

    function drawField() {
        // Draw field lines (simplified)
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2 / scale;
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();
    }

    function drawPlayers() {
        players.forEach(player => player.draw(ctx));
    }

    function addPlayer(event) {
        if (!isAddingOffensivePlayer && !isAddingDefensivePlayer) return;

        const [x, y] = getMousePos(canvas, event);
        const isOffense = isAddingOffensivePlayer;
        const label = isOffense ? 'O' : 'D';
        players.push(new Player(x, y, isOffense, label));
        isAddingOffensivePlayer = false;
        isAddingDefensivePlayer = false;
        redraw();
    }

    function selectPlayer(event) {
        const [x, y] = getMousePos(canvas, event);
        selectedPlayer = players.find(player => player.isPointInside(x, y));
    }

    function movePlayer(event) {
        if (!selectedPlayer) return;
        const [x, y] = getMousePos(canvas, event);
        selectedPlayer.x = x;
        selectedPlayer.y = y;
        redraw();
    }

    function stopMovingPlayer() {
        selectedPlayer = null;
    }


    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        return [
            (evt.clientX - rect.left) / (rect.width / width),
            (evt.clientY - rect.top) / (rect.height / height)
        ];
    }

    function savePlay() {
        const playData = {
            players: players.map(p => ({
                x: p.x,
                y: p.y,
                isOffense: p.isOffense,
                label: p.label,
                route: p.route
            })),
            imageData: canvas.toDataURL()
        };
        console.log('Play saved:', playData);
        // You could emit an event here with the play data
    }

    function loadPlay(data) {
        players = data.players.map(p => {
            const player = new Player(p.x, p.y, p.isOffense, p.label);
            player.route = p.route;
            return player;
        });
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, width, height);
            drawPlayers();
            drawPlayerRoutes();
        };
        img.src = data.imageData;
    }

    function clearCanvas() {
        players = [];
        initCanvas();
    }
</script>

<div class="play-drawing">
    <canvas
        bind:this={canvas}
        width={canvasWidth}
        height={canvasHeight}
        style="width: {width}px; height: {height}px;"
        on:click={isDrawingRoute ? startDrawingRoute : addPlayer}
        on:dblclick={endDrawingRoute}
        on:mousedown={selectPlayer}
        on:mousemove={event => {
            updateMousePosition(event);
            movePlayer(event);
        }}
        on:mouseup={stopMovingPlayer}
        on:mouseout={stopMovingPlayer}
    ></canvas>

    {#if editable}
        <div class="controls">
            <button on:click={() => { isAddingOffensivePlayer = true; isAddingDefensivePlayer = false; isDrawingRoute = false; }}>
                Add Offensive Player
            </button>
            <button on:click={() => { isAddingDefensivePlayer = true; isAddingOffensivePlayer = false; isDrawingRoute = false; }}>
                Add Defensive Player
            </button>
            <button on:click={() => { isDrawingRoute = true; isAddingOffensivePlayer = false; isAddingDefensivePlayer = false; }}>
                Draw Route
            </button>
            <button on:click={savePlay}>Save Play</button>
            <button on:click={clearCanvas}>Clear</button>
        </div>
    {/if}
</div>

<style>
    .play-drawing {
        display: inline-block;
        border: 1px solid #ccc;
    }
    canvas {
        cursor: crosshair;
    }
    .controls {
        margin-top: 10px;
    }
    button {
        margin-right: 10px;
    }
</style>