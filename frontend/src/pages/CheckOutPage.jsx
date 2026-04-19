import React, { useState, useRef } from "react";
import { auth } from "../utils/auth";
import { apiFetch } from "../utils/api";

const MAX_BOARD_SIZE = 480;

const ratioConfig = {
    "1:1": { value: 1, pieces: [9, 25, 36] },
    "4:3": { value: 4 / 3, pieces: [12, 48] },
    "3:4": { value: 3 / 4, pieces: [12, 48] },
    "16:9": { value: 16 / 9, pieces: [16, 40] },
    "9:16": { value: 9 / 16, pieces: [16, 40] },
};

function chooseGrid(count, ratio) {
    let best = { rows: 1, cols: count, score: Infinity };

    for (let rows = 1; rows <= count; rows++) {
        if (count % rows !== 0) continue;
        const cols = count / rows;
        const score = Math.abs(cols / rows - ratio);
        if (score < best.score) best = { rows, cols, score };
    }

    return { rows: best.rows, cols: best.cols };
}

function createPieces(imageUrl, rows, cols, boardW, boardH) {
    const tileW = Math.floor(boardW / cols);
    const tileH = Math.floor(boardH / rows);
    const actualBoardW = tileW * cols;
    const actualBoardH = tileH * rows;

    const SCATTER_PAD = 16;
    const scatterW = Math.max(actualBoardW + SCATTER_PAD * 2, 300);
    const scatterH = Math.max(actualBoardH + SCATTER_PAD * 2, 300);

    const pieces = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const left =
                SCATTER_PAD +
                Math.random() * Math.max(0, scatterW - tileW - SCATTER_PAD * 2);
            const top =
                SCATTER_PAD +
                Math.random() * Math.max(0, scatterH - tileH - SCATTER_PAD * 2);

            pieces.push({
                id: r * cols + c,
                r,
                c,
                correctLeft: c * tileW,
                correctTop: r * tileH,
                left,
                top,
                locked: false,
                onBoard: false,
                tileW,
                tileH,
                imageUrl,
                boardW: actualBoardW,
                boardH: actualBoardH,
            });
        }
    }

    return {
        pieces,
        boardW: actualBoardW,
        boardH: actualBoardH,
        tileW,
        tileH,
        scatterW,
        scatterH,
    };
}

export default function CheckOutPage() {
    const [pieces, setPieces] = useState([]);
    const [boardInfo, setBoardInfo] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [assetSize, setAssetSize] = useState({ w: 0, h: 0 });
    const [selectedRatio, setSelectedRatio] = useState("");
    const [options, setOptions] = useState([]);
    const [selectedCount, setSelectedCount] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState("");

    const [message, setMessage] = useState(
        "Pasirinkite jūsų nuotraukos santykį ir įkelkite nuotrauką užsakymui"
    );
    const [solved, setSolved] = useState(false);
    const [rewardClaimed, setRewardClaimed] = useState(false);
    const [discountToken, setDiscountToken] = useState(null);
    const [showOrder, setShowOrder] = useState(false);
    const [createdPuzzleId, setCreatedPuzzleId] = useState(null);

    const [fullName, setFullName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiration, setExpiration] = useState("");
    const [cvv, setCvv] = useState("");
    const [orderMessage, setOrderMessage] = useState("");
    const [ordering, setOrdering] = useState(false);

    const [floater, setFloater] = useState(null);

    const drag = useRef(null);
    const boardRef = useRef(null);
    const trayRef = useRef(null);

    function getBoardSize(ratio) {
        let width = MAX_BOARD_SIZE;
        let height = Math.round(width / ratio);

        if (height > MAX_BOARD_SIZE) {
            height = MAX_BOARD_SIZE;
            width = Math.round(height * ratio);
        }

        return { width, height };
    }

    const buildPuzzle = (count, assetW, assetH, url, ratioValue) => {
        const { width: boardW, height: boardH } = getBoardSize(ratioValue);
        const grid = chooseGrid(count, ratioValue);
        const result = createPieces(url, grid.rows, grid.cols, boardW, boardH);

        setPieces(result.pieces);
        setBoardInfo({
            width: result.boardW,
            height: result.boardH,
            tileW: result.tileW,
            tileH: result.tileH,
            scatterW: result.scatterW,
            scatterH: result.scatterH,
            rows: grid.rows,
            cols: grid.cols,
        });

        setSolved(false);
        setRewardClaimed(false);
        setDiscountToken(null);
        setShowOrder(false);
        setOrderMessage("");
        setCreatedPuzzleId(null);
        setMessage("Sudėkite puzlę ir gaukite prizą!");
    };

    const shuffleUnsolved = () => {
        const trayRect = trayRef.current.getBoundingClientRect();

        setPieces((prev) =>
            prev.map((p) => {
                if (p.locked) return p;

                const randomX = Math.random() * (trayRect.width - p.tileW);
                const randomY = Math.random() * (trayRect.height - p.tileH);

                return {
                    ...p,
                    left: randomX,
                    top: randomY,
                    onBoard: false,
                };
            })
        );
    };

    const handleRatioChange = (e) => {
        const key = e.target.value;
        const cfg = ratioConfig[key];

        setSelectedRatio(key);
        setOptions(cfg.pieces);
        setSelectedCount(cfg.pieces[0]);
    };

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadedFileName(file.name);
        const url = URL.createObjectURL(file);

        const img = new Image();
        img.onload = () => {
            setImageUrl(url);
            setAssetSize({ w: img.width, h: img.height });

            buildPuzzle(
                selectedCount,
                img.width,
                img.height,
                url,
                ratioConfig[selectedRatio].value
            );
        };
        img.src = url;
    };

    const handleCountChange = (e) => {
        const count = Number(e.target.value);
        setSelectedCount(count);

        if (imageUrl && assetSize.w) {
            buildPuzzle(
                count,
                assetSize.w,
                assetSize.h,
                imageUrl,
                ratioConfig[selectedRatio].value
            );
        }
    };

    const startDrag = (e, id, fromBoard) => {
        e.preventDefault();

        const piece = pieces.find((p) => p.id === id);
        if (!piece || piece.locked) return;

        const containerRef = fromBoard ? boardRef : trayRef;
        const rect = containerRef.current.getBoundingClientRect();

        const offsetX = e.clientX - (rect.left + piece.left);
        const offsetY = e.clientY - (rect.top + piece.top);

        drag.current = { id, fromBoard, offsetX, offsetY };
        setFloater({ id, pageX: e.clientX, pageY: e.clientY });
    };

    const onMouseMove = (e) => {
        if (!drag.current) return;
        setFloater({ id: drag.current.id, pageX: e.clientX, pageY: e.clientY });
    };

   const savePuzzleAndIssueToken = async () => {
        const user = auth.getUser();
        console.log("USER FROM TOKEN:", user); // 👈 add this
        if (!user) return;

        try {
            const createPuzzleResponse = await apiFetch("/api/puzzle/create", {
                method: "POST",
                body: JSON.stringify({
                    userId: user.userId,
                    pieceCount: selectedCount,
                    originalFilename: uploadedFileName || "uploaded-image.jpg",
                }),
            });
            
            const createPuzzleText = await createPuzzleResponse.text();
            let createPuzzleData = {};
            try {
                createPuzzleData = createPuzzleText ? JSON.parse(createPuzzleText) : {};
            } catch {
                throw new Error(createPuzzleText || "Nepavyko išsaugoti dėlionės");
            }
            if (!createPuzzleResponse.ok) {
                throw new Error(createPuzzleData.message || "Nepavyko išsaugoti dėlionės");
            }

            setCreatedPuzzleId(createPuzzleData.id);

            const tokenResponse = await apiFetch("/api/completiontoken/issue", {
                method: "POST",
                body: JSON.stringify({
                    puzzleId: createPuzzleData.id,
                }),
            });

            const tokenText = await tokenResponse.text();
            let tokenData = {};
            try {
                tokenData = tokenText ? JSON.parse(tokenText) : {};
            } catch {
                throw new Error(tokenText || "Nepavyko sugeneruoti nuolaidos žetono");
            }
            if (!tokenResponse.ok) {
                throw new Error(tokenData.error || "Nepavyko sugeneruoti nuolaidos žetono");
            }

            setDiscountToken(tokenData.token);
        } catch (err) {
            console.error("savePuzzleAndIssueToken error:", err);
            alert(err.message || "Nepavyko išsaugoti dėlionės.");
        }
    };

    const handleOrder = async () => {
        const user = auth.getUser();

        if (!user) {
            alert("Pirmiausia prisijunkite.");
            return;
        }

        if (!createdPuzzleId) {
            alert("Pirmiausia reikia išsaugoti dėlionę.");
            return;
        }

        if (!fullName || !cardNumber || !expiration || !cvv) {
            alert("Užpildykite visus mokėjimo laukus.");
            return;
        }

        try {
            setOrdering(true);
            setOrderMessage("");

            const response = await apiFetch("/api/order", {
            method: "POST",
            body: JSON.stringify({
                userId: user.userId,
                puzzleId: createdPuzzleId,
                fullName,
                cardNumber,
                expiration,
                cvv,
            }),
        });

            const text = await response.text();

            let data = {};
            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                throw new Error(text || "Server returned invalid response");
            }

            if (!response.ok) {
                throw new Error(data.message || "Užsakymas nepavyko");
            }

            setOrderMessage(`✅ ${data.message}. Užsakymo ID: ${data.orderId}`);
        } catch (error) {
            setOrderMessage(`❌ ${error.message}`);
        } finally {
            setOrdering(false);
        }
    };

    const onMouseUp = (e) => {
        if (!drag.current) {
            setFloater(null);
            return;
        }

        const { id, offsetX, offsetY } = drag.current;
        drag.current = null;

        const piece = pieces.find((p) => p.id === id);
        if (!piece) {
            setFloater(null);
            return;
        }

        const boardRect = boardRef.current.getBoundingClientRect();
        const trayRect = trayRef.current.getBoundingClientRect();

        const piecePageX = e.clientX - offsetX;
        const piecePageY = e.clientY - offsetY;

        const centrePX = piecePageX + piece.tileW / 2;
        const centrePY = piecePageY + piece.tileH / 2;

        const overBoard =
            centrePX >= boardRect.left &&
            centrePX <= boardRect.right &&
            centrePY >= boardRect.top &&
            centrePY <= boardRect.bottom;

        const nextPieces = pieces.map((p) => {
            if (p.id !== id) return p;

            if (overBoard) {
                const localX = piecePageX - boardRect.left;
                const localY = piecePageY - boardRect.top;
                const snapX = Math.round(localX / p.tileW) * p.tileW;
                const snapY = Math.round(localY / p.tileH) * p.tileH;
                const dx = Math.abs(p.correctLeft - snapX);
                const dy = Math.abs(p.correctTop - snapY);
                const threshold = Math.max(8, Math.min(p.tileW, p.tileH) * 0.2);

                if (dx <= threshold && dy <= threshold) {
                    return {
                        ...p,
                        left: p.correctLeft,
                        top: p.correctTop,
                        locked: true,
                        onBoard: true,
                    };
                }

                return {
                    ...p,
                    left: snapX,
                    top: snapY,
                    locked: false,
                    onBoard: true,
                };
            }

            const localX = Math.max(
                0,
                Math.min(piecePageX - trayRect.left, trayRect.width - p.tileW)
            );
            const localY = Math.max(
                0,
                Math.min(piecePageY - trayRect.top, trayRect.height - p.tileH)
            );

            return {
                ...p,
                left: localX,
                top: localY,
                locked: false,
                onBoard: false,
            };
        });

        const justSolved = nextPieces.every((p) => p.locked);

        setPieces(nextPieces);

        if (justSolved) {
            setMessage("Puzlė sudėta sėkmingai!");
            setSolved(true);
            savePuzzleAndIssueToken();
        }

        setFloater(null);
    };

    const boardPieces = pieces.filter((p) => p.onBoard);
    const trayPieces = pieces.filter((p) => !p.onBoard);
    const floatingPiece = floater ? pieces.find((p) => p.id === floater.id) : null;

    return (
        <div
            style={{
                fontFamily: "sans-serif",
                padding: 24,
                userSelect: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "100vh",
                overflowY: "auto",
                background: "linear-gradient(to right, #f5f7fa, #c3cfe2)",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
        >
            <h1 style={{ marginBottom: 8 }}>Foto-Puzlė</h1>
            <p style={{ color: "#555", marginBottom: 16 }}>{message}</p>

            {solved && (
                <div
                    style={{
                        marginBottom: 20,
                        padding: 16,
                        border: "2px solid #16a34a",
                        borderRadius: 8,
                        background: "#c3cfe2",
                        textAlign: "center",
                        maxWidth: 500,
                        width: "100%",
                    }}
                >
                    <h2 style={{ margin: "0 0 8px 0", color: "#166534" }}>
                        🎉 Sveikiname!
                    </h2>

                    <p style={{ marginBottom: 12 }}>
                        Jūs laimėjote <b>5% nuolaidą</b> kitam pirkiniui.
                    </p>

                    <button
                        onClick={() => {
                            setRewardClaimed(true);
                            alert(
                                "Prizas atsiimtas! Jūsų profilis papildytas 5% nuolaidos žetonu, jį galite panaudoti kitam apsipirkimui."
                            );
                        }}
                        disabled={rewardClaimed || !discountToken}
                        style={{
                            padding: "8px 16px",
                            background: rewardClaimed || !discountToken ? "#9ca3af" : "#16a34a",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            cursor: rewardClaimed || !discountToken ? "not-allowed" : "pointer",
                            fontWeight: 600,
                        }}
                    >
                        {rewardClaimed
                            ? "Prizas jau atsiimtas"
                            : !discountToken
                                ? "Kraunama..."
                                : "Atsiimti prizą"}
                    </button>

                    <div style={{ marginTop: 12 }}>
                        <button
                            onClick={() => setShowOrder(true)}
                            style={{
                                padding: "8px 16px",
                                background: "#2563eb",
                                color: "#fff",
                                border: "none",
                                borderRadius: 6,
                                cursor: "pointer",
                                fontWeight: 600,
                            }}
                        >
                            Užsakyti dėlionę
                        </button>
                    </div>

                    {showOrder && (
                        <div style={{ marginTop: 20, textAlign: "left" }}>
                            <h3>Užsakyti dėlionę</h3>

                            <input
                                type="text"
                                placeholder="Vardas Pavardė"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                style={{
                                    display: "block",
                                    marginBottom: 10,
                                    padding: 8,
                                    width: "100%",
                                    boxSizing: "border-box",
                                }}
                            />

                            <input
                                type="text"
                                placeholder="Kortelės numeris"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                style={{
                                    display: "block",
                                    marginBottom: 10,
                                    padding: 8,
                                    width: "100%",
                                    boxSizing: "border-box",
                                }}
                            />

                            <input
                                type="text"
                                placeholder="Galiojimas (MM/YY)"
                                value={expiration}
                                onChange={(e) => setExpiration(e.target.value)}
                                style={{
                                    display: "block",
                                    marginBottom: 10,
                                    padding: 8,
                                    width: "100%",
                                    boxSizing: "border-box",
                                }}
                            />

                            <input
                                type="text"
                                placeholder="CVV"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                style={{
                                    display: "block",
                                    marginBottom: 10,
                                    padding: 8,
                                    width: "100%",
                                    boxSizing: "border-box",
                                }}
                            />

                            <button
                                onClick={handleOrder}
                                disabled={ordering}
                                style={{
                                    padding: "8px 16px",
                                    background: "#2563eb",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 6,
                                    cursor: "pointer",
                                    fontWeight: 600,
                                }}
                            >
                                {ordering ? "Siunčiama..." : "Patvirtinti užsakymą"}
                            </button>

                            {orderMessage && (
                                <p style={{ marginTop: 12, fontWeight: 600 }}>{orderMessage}</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {!solved && (
                <div
                    style={{
                        display: "flex",
                        gap: 16,
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 24,
                    }}
                >
                    <label style={{ fontWeight: 600 }}>
                        Santykis&nbsp;
                        <select value={selectedRatio} onChange={handleRatioChange}>
                            <option value="" disabled>
                                Pasirinkite
                            </option>
                            {Object.keys(ratioConfig).map((k) => (
                                <option key={k} value={k}>
                                    {k}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label
                        onClick={(e) => {
                            if (!selectedRatio) {
                                e.preventDefault();
                                alert("Pirmiausia pasirinkite santykį");
                            }
                        }}
                        style={{
                            fontWeight: 600,
                            cursor: selectedRatio ? "pointer" : "not-allowed",
                            color: selectedRatio ? "#1d4ed8" : "#9ca3af",
                            opacity: selectedRatio ? 1 : 0.5,
                        }}
                    >
                        Pasirinkite nuotrauką&nbsp;
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFile}
                            style={{ display: "none" }}
                            disabled={!selectedRatio}
                        />
                    </label>

                    {imageUrl && (
                        <label style={{ fontWeight: 600 }}>
                            Detalių skaičius&nbsp;
                            <select value={selectedCount} onChange={handleCountChange}>
                                {options.map((o) => (
                                    <option key={o} value={o}>
                                        {o} detalės
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}

                    {boardInfo && (
                        <button
                            onClick={() => shuffleUnsolved()}
                            style={{ padding: "4px 14px", cursor: "pointer" }}
                        >
                            Sumaišyti nesudėtas detales
                        </button>
                    )}
                </div>
            )}

            {boardInfo ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: solved ? "column" : "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 24,
                        width: "100%",
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div
                            ref={boardRef}
                            style={{
                                position: "relative",
                                width: boardInfo.width,
                                height: boardInfo.height,
                                border: "2px solid #374151",
                                background: "#e5e7eb",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                            }}
                        >
                            {!solved && (
                                <>
                                    {Array.from({ length: boardInfo.rows + 1 }).map((_, i) => (
                                        <div
                                            key={`h${i}`}
                                            style={{
                                                position: "absolute",
                                                left: 0,
                                                right: 0,
                                                top: i * boardInfo.tileH - 1,
                                                height: 1,
                                                background: "rgba(0,0,0,0.15)",
                                                pointerEvents: "none",
                                            }}
                                        />
                                    ))}

                                    {Array.from({ length: boardInfo.cols + 1 }).map((_, i) => (
                                        <div
                                            key={`v${i}`}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                bottom: 0,
                                                left: i * boardInfo.tileW - 1,
                                                width: 1,
                                                background: "rgba(0,0,0,0.15)",
                                                pointerEvents: "none",
                                            }}
                                        />
                                    ))}
                                </>
                            )}

                            {boardPieces.map((p) => {
                                const isFloating = floater?.id === p.id;
                                if (isFloating) return null;

                                return (
                                    <PuzzlePiece
                                        solved={solved}
                                        key={p.id}
                                        piece={p}
                                        imageUrl={imageUrl}
                                        boardW={boardInfo.width}
                                        boardH={boardInfo.height}
                                        onMouseDown={(e) => startDrag(e, p.id, true)}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {!solved && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div
                                ref={trayRef}
                                style={{
                                    position: "relative",
                                    width: boardInfo.width,
                                    height: boardInfo.height,
                                    overflowY: "auto",
                                    border: "2px dashed #9ca3af",
                                    background: "#f9fafb",
                                    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.06)",
                                }}
                            >
                                {trayPieces.map((p) => {
                                    const isFloating = floater?.id === p.id;
                                    if (isFloating) return null;

                                    return (
                                        <PuzzlePiece
                                            solved={solved}
                                            key={p.id}
                                            piece={p}
                                            imageUrl={imageUrl}
                                            boardW={boardInfo.width}
                                            boardH={boardInfo.height}
                                            onMouseDown={(e) => startDrag(e, p.id, false)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            ) : null}

            {floatingPiece && floater && boardInfo && (
                <PuzzlePiece
                    solved={solved}
                    piece={floatingPiece}
                    imageUrl={imageUrl}
                    boardW={boardInfo.width}
                    boardH={boardInfo.height}
                    style={{
                        position: "fixed",
                        left: floater.pageX - (drag.current?.offsetX ?? 0),
                        top: floater.pageY - (drag.current?.offsetY ?? 0),
                        zIndex: 9999,
                        pointerEvents: "none",
                        opacity: 0.92,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                        cursor: "grabbing",
                    }}
                />
            )}
        </div>
    );
}

function PuzzlePiece({ piece, imageUrl, boardW, boardH, onMouseDown, style = {}, solved }) {
    const { left, top, tileW, tileH, r, c, locked } = piece;

    const bgStyle = imageUrl
        ? {
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: `${boardW}px ${boardH}px`,
            backgroundPosition: `-${c * tileW}px -${r * tileH}px`,
            backgroundRepeat: "no-repeat",
        }
        : { background: locked ? "#86efac" : "#93c5fd" };

    return (
        <div
            onMouseDown={onMouseDown}
            style={{
                position: "absolute",
                left,
                top,
                zIndex: locked ? 1 : 10,
                width: tileW,
                height: tileH,
                ...bgStyle,
                border: solved
                    ? "none"
                    : locked
                        ? "1px solid rgba(0,180,0,0.6)"
                        : "1.5px solid rgba(0,0,0,0.35)",
                outline: solved ? "none" : locked ? "1px solid #16a34a" : "none",
                boxSizing: "border-box",
                cursor: locked ? "default" : "grab",
                ...style,
            }}
        />
    );
}