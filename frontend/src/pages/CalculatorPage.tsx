// src/App.tsx
import React, { useState } from "react";
import DigitCanvas from "../components/DigitCanvas";
import OperatorSelect from "../components/OperatorSelect";

interface Term {
    id: number;
    val: number;
}

const CalculatorPage = () => {    // 상태 관리
    const [terms, setTerms] = useState<Term[]>([{ id: Date.now(), val: 0 }]);
    const [operators, setOperators] = useState<string[]>([]);
    const [result, setResult] = useState<number | string>("");

    // 항 추가
    const addTerm = () => {
        setTerms([...terms, { id: Date.now(), val: 0 }]);
        setOperators([...operators, "+"]);
    };

    // 항 삭제
    const removeTerm = (index: number) => {
        const newTerms = [...terms];
        newTerms.splice(index, 1);

        const newOps = [...operators];
        // 첫 번째 항이 아니라면 그 앞의 연산자를 제거, 첫 번째면 뒤의 연산자 제거 로직
        if (index > 0) newOps.splice(index - 1, 1);
        else newOps.shift();

        setTerms(newTerms);
        setOperators(newOps);
    };

    // 숫자 업데이트 (하위 컴포넌트에서 호출)
    const handleUpdateVal = (id: number, num: number) => {
        setTerms(prev => prev.map(t => t.id === id ? { ...t, val: num } : t));
    };

    // 연산자 업데이트
    const handleOperatorChange = (index: number, op: string) => {
        const newOps = [...operators];
        newOps[index] = op;
        setOperators(newOps);
    };

    // 최종 계산
    const calculate = () => {
        let formula = "";
        terms.forEach((term, i) => {
            formula += term.val;
            if (i < operators.length) {
                formula += ` ${operators[i]} `;
            }
        });

        try {
            // eslint-disable-next-line no-eval
            const calcResult = eval(formula);
            setResult(Number.isInteger(calcResult) ? calcResult : calcResult.toFixed(2));
        } catch {
            setResult("Error");
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">📝 손글씨 AI 계산기</h1>
            <p className="page-desc">네모 칸에 숫자를 쓰고 자동으로 계산해보세요.</p>

            <div className="equation-area">
                {terms.map((term, index) => (
                    <React.Fragment key={term.id}>
                        {/* 연산자 (첫 번째 항 제외) */}
                        {index > 0 && (
                            <OperatorSelect
                                value={operators[index - 1]}
                                onChange={(op) => handleOperatorChange(index - 1, op)}
                            />
                        )}

                        {/* 숫자 칸 */}
                        <DigitCanvas
                            id={term.id}
                            value={term.val}
                            onPredict={handleUpdateVal}
                            onDelete={() => removeTerm(index)}
                            isRemovable={terms.length > 1}
                        />
                    </React.Fragment>
                ))}

                {/* 추가 버튼 */}
                <button onClick={addTerm} className="add-btn">
                    + 칸 추가
                </button>
            </div>

            <div className="footer">
                <button onClick={calculate} className="calc-btn">
                    = 계산하기
                </button>
                <div className="result-display">
                    결과: <span className="result-value">{result}</span>
                </div>
            </div>
        </div>
    );
}

export default CalculatorPage;