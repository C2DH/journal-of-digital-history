var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var Logo = function (_a) {
    var _b = _a.color, color = _b === void 0 ? 'black' : _b, _c = _a.size, size = _c === void 0 ? 50 : _c, rest = __rest(_a, ["color", "size"]);
    return (_jsx("div", __assign({ className: "Logo" }, rest, { children: _jsxs("svg", { className: "position-absolute top-0", xmlns: "http://www.w3.org/2000/svg", height: size, viewBox: "0 0 150 100", children: [_jsx("rect", { x: "70", y: "50", width: "10", height: "10", rx: "5" }), _jsx("path", { fill: color, d: "M130,40H120V20H100V10H70V30H60V20H30V50H10V90H60V80H90V90h50V40ZM40,80H20V60H30V70H40V30H50V80ZM80,70H60V40H80V20H90V70Zm50-10V80H120V60H110V80H100V30h10V50h20Z" })] }) })));
};
export default Logo;
