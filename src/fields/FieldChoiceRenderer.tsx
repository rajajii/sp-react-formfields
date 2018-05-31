import * as React from 'react';
import { IFieldProps, FormMode } from '../interfaces';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { BaseFieldRenderer } from './BaseFieldRenderer';

export class FieldChoiceRenderer extends BaseFieldRenderer {
  public constructor(props: IFieldProps) {
    super(props);
    let vals = [];
    if (this.props.FormFieldValue != null) {
      if (this.props.IsMulti) {
        vals = this.props.FormFieldValue.results;
      } else {
        vals.push(this.props.FormFieldValue);
      }
    }
    this.state = {
      ...this.state,
      currentValue: vals
    };
  }

  protected renderNewForm() {
    return this.renderNewOrEditForm();
  }

  protected renderEditForm() {
    return this.renderNewOrEditForm();
  }

  protected renderDispForm() {
    if (this.props.IsMulti && this.props.FormFieldValue != null) {
      return (
        this.props.FormFieldValue.results.map((fv, i) => <Label key={`${this.props.InternalName}_${i}`}>{fv}</Label>)
      );
    }
    return (<Label>{this.props.FormFieldValue}</Label>);
  }

  private renderNewOrEditForm() {
    return (
      <Dropdown
        key={`dropdown_${this.props.InternalName}`}
        multiSelect={this.props.IsMulti}
        onChanged={(newValue) => this.saveFieldDataInternal(newValue)}
        options={this.props.Choices.map(c => ({key: c, text: c, selected: (this.state.currentValue as string[]).includes(c)}))}
        placeHolder={this.props.IsMulti ? 'Select options' : 'Select an option'}
      />
    );
  }

  private saveFieldDataInternal(newValue: any) {
    if (this.props.IsMulti) {
      this.setState({currentValue: this.constructNewState(newValue.key, newValue.selected)}, () => {
        this.trySetChangedValue({results: this.state.currentValue});
      });
    } else {
      this.setState({currentValue: [newValue.key]}, () => {
        this.trySetChangedValue(this.state.currentValue.length > 0 ? this.state.currentValue[0] : undefined);
      });
    }
  }

  private constructNewState(value: string, toAdd: boolean): string[] {
    let result: string[] = this.state.currentValue;
    if (toAdd) {
      let filtered = this.state.currentValue.filter(i => i === value);
      if (!(this.state.currentValue as string[]).includes(value)) {
        result = [value, ...this.state.currentValue];
      }
    } else {
      result = [];
      for (let i of this.state.currentValue) {
        if (i !== value) {
          result.push(i);
        }
      }
    }
    return result;
  }
}