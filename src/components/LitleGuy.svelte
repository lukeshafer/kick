<script lang="ts">
	let imgPos = 0
	const move = (dir: "left" | "right") => {
		const moveDist = dir === "left" ? -10 : 10;
		imgPos = imgPos + moveDist;
	}

	const handleKeydown = (e: KeyboardEvent) => {
		switch (e.key) {
			case "ArrowLeft": 
				move("left");
				break;
			case "ArrowRight":
				move("right");
		}
	}

</script>

<svelte:window on:keydown={handleKeydown} />

<img style:transform={`translateX(${imgPos}px)`} src="/pixil-f0.png" alt="" width={128} height={128} />

