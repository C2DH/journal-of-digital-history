import { jsx as _jsx } from "react/jsx-runtime";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
var CustomTooltip = function (_a) {
    var tooltip = _a.tooltip, _b = _a.tooltipPlacement, tooltipPlacement = _b === void 0 ? 'right' : _b, fieldname = _a.fieldname, index = _a.index;
    var t = useTranslation().t;
    return (_jsx(OverlayTrigger, { placement: tooltipPlacement, overlay: _jsx(Tooltip, { id: "tooltip-".concat(fieldname, "-").concat(index), className: "custom-tooltip", children: t("".concat(tooltip)) }), children: _jsx("span", { className: "material-symbols-outlined ms-2", style: { cursor: 'pointer' }, children: "help" }) }));
};
export default CustomTooltip;
