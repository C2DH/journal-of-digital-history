import React from 'react'
import LazyFigure from './LazyFigure'

export default {
  component: LazyFigure,
  title: 'Lazy loading Figure',
  argTypes: {
    src: {
      required: false,
      control: { type: 'text' },
      description: 'The url of the picture.',
      table: {
        type: { summary: 'url' },
      },
    },
    base64: {
      required: false,
      control: { type: 'text' },
      description:
        'The base64 representing a tiny version of the image, aloing with the mimetype, e.g. `data:image/png;base64,`',
      table: {
        type: { summary: 'base64' },
      },
      defaultValue:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNUUlayBwABfgCoNp4e8AAAAABJRU5ErkJggg==',
    },
    aspectRatio: {
      required: false,
      description: 'The ratio of the picture width to its height, expressed as floating number.',
      table: {
        type: { summary: 'float or "auto"' },
      },
      control: { type: 'number' },
      defaultValue: 1.0,
    },
    delay: {
      required: false,
      control: { type: 'number' },
      defaultValue: 1000,
    },
  },
}

const Template = (args) => {
  return <LazyFigure {...args} />
}

export const Default = Template.bind({})

Default.args = {
  aspectRatio: 0.682788,
  src: 'https://www.framingluxembourg.lu/media/images/travailleurs-haut-fourneau-1900.large-w.jpg',
  base64:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAUCAIAAAD+/qGQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEhklEQVQ4yzWU1y9mURTFz5OQaMPoffTejTZE77230XvvLXpntIhEECFEPBCihkh4kBDxQuJN8CDiz5jf3JvZDyf3O+fstddae59P2NraBgcHx8XFeXt7u7i4uLu7Ozk5WVtbm5ubm5iYmJmZGRoaWllZ/ZKCD11dXV9fXy4bGRlxgVM+jI2Nf0hBop2dnbOzswgPD+/o6Dg4OOjv729vbyfB3t6eGyCympqa6unpARcUFBQZGQkJbW1tNzc3ahsYGIDIqq+vzweXraSwtLTkVJSWloaEhCQmJnZ3d4+MjKSkpPj7+0OEBAsLC4pTgHs1NTXchCm4gYGBjo6OwHENREMpoMx9VEKZUwE7try8vK6vryFOWXC/S8G+p6cnzsCip6envr6eBDL9/PzkLErK0KZSmEthY2Pzjy9nWMbZ4uLiysoKCdCHlExHR0eHFeiGhgZwfXx8QkNDY2JisIJEsGSX+ZB9kFcHBwdBJpIxUVNTk87QOixGF2f0U0tLi3x2JicnqUobsKu8vJwjeMkEZdaE3A/8xQrxTQoNDQ01NTVlZWXQcYAy9BOCMEV7UlLSwsLCzs7O29vb0dERR0FS8EEzXV1duQMP/AUREzw8PAQoYAEKurq6upYUfNOx31Lg5szMDKC0dHBwkLEBC77k05Wf/4NvUhCBRVFRUUJFRQU4+KqqqtIKarCjqKiIlbGxsdgC66mpqdnZ2crKyvT09MzMzISEBCDQC0G0s9JeGZRNuP/DxbuSkhJ+KykpoQUgbtA0FMGLkerr60NvamoqBeLj49PS0kBn8rkgvxrYkEUD6RizFBAQEB0dLVC3trbGgYKCQm5uLj9zcnI4g0VZWRm4WVlZwNEr+Obl5dXW1i4tLdFhfHCTAq8ojA+URCXfRUVFoqKiAu/Qzmzl5+cXFxczZ7wrRJEwOjrKc6Bec3MzNCnAisscYUhycjJaCwoKeKj8rK6ulp8Mz0dQv7W1FXPTpfgjBegIxCZmC5rkAM2AUwMudXV1iEABylh5MuBmZGQMDAzQBhRgt6A4BSFCKSaG7gPR1NSEd0gDlMIRERGsQ0NDwFES+xgyxFFveHiYyQMOiyCERSjIzs4WLy8v+DA2Nsbo4CmDDRw5DDzHPAdeGr3Fa14E+729vfQARIAwNFcKRFByfn4elsvLy7e3t4JR54vbYWFhSMB43KH70AeRq42NjTjODp3AKMS2tbXJ1BgYtLLPqKCD+7yg+/v7j48PcXNzg2qMg39VVVWqFIWFhdQfHx+fnp7mnwxcSMEFjnt7e8fHx/Sts7Nzc3OTlw0n6mGxXH5/f5/RFNvb2xsbG7u7u3jEbwrQxrm5Ob4Rjg88MBpIr7EYamhvaWmhGNBdXV0c0RI2GRjMYXNiYgLTBQ+ffKiRg6Fwpz+IZaUS9ahB02HHq1tdXcWEra2t09NTykCTxvKI+fvmG750mPE4OzsTDw8PV1dXJycnh4eHrOfn5xcXF+zc3d3hFKdPT0+Pj4/Pz8+vr6/v7++sn5+fX19fXEY7ci8vLzGHKYQm/V9fX+faX7xINsszV7wCAAAAAElFTkSuQmCC',
}
