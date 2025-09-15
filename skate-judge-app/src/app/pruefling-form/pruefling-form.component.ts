import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Exam } from '../shared/models/event.interface';

@Component({
  selector: 'app-pruefling-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './pruefling-form.component.html',
  styleUrls: ['./pruefling-form.component.scss']
})
export class PrueflingFormComponent implements OnInit {
  prueflingForm: FormGroup;
  availableExams: Exam[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PrueflingFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { eventId: string, exams: Exam[], preSelectedExam?: Exam }
  ) {
    // Form will be initialized in ngOnInit
    this.prueflingForm = this.fb.group({});
  }

  private capitalizeFirstLetter(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  private capitalizedFirstLetterValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      
      const firstLetter = value.charAt(0);
      if (firstLetter !== firstLetter.toUpperCase()) {
        return { capitalizedFirstLetter: true };
      }
      return null;
    };
  }

  ngOnInit() {
    this.availableExams = this.data.exams || [];

    // If a specific exam is pre-selected, set it in the form
    if (this.data.preSelectedExam) {
      this.prueflingForm = this.fb.group({
        vorname: ['', Validators.required],
        nachname: ['', [Validators.required, Validators.pattern(/^[a-zA-ZäöüÄÖÜß\-\s]+$/)]],
        verein: ['', Validators.required],
        exam: [[this.data.preSelectedExam], Validators.required] // Pre-select the exam
      });
    } else {
      this.prueflingForm = this.fb.group({
        vorname: ['', Validators.required],
        nachname: ['', [Validators.required, Validators.pattern(/^[a-zA-ZäöüÄÖÜß\-\s]+$/)]],
        verein: ['', Validators.required],
        exam: [[], Validators.required]
      });
    }

    // Add value change listeners to auto-capitalize
    this.prueflingForm.get('vorname')?.valueChanges.subscribe(value => {
      if (value && typeof value === 'string') {
        const capitalized = this.capitalizeFirstLetter(value);
        if (capitalized !== value) {
          this.prueflingForm.patchValue({ vorname: capitalized }, { emitEvent: false });
        }
      }
    });

    this.prueflingForm.get('nachname')?.valueChanges.subscribe(value => {
      if (value && typeof value === 'string') {
        const capitalized = this.capitalizeFirstLetter(value);
        if (capitalized !== value) {
          this.prueflingForm.patchValue({ nachname: capitalized }, { emitEvent: false });
        }
      }
    });
  }

  isExamSelected(exam: Exam): boolean {
    const selectedExams = this.prueflingForm.get('exam')?.value || [];
    return selectedExams.some((selected: Exam) => selected.id === exam.id);
  }

  onExamChange(event: any, exam: Exam) {
    const examControl = this.prueflingForm.get('exam');
    const currentExams = examControl?.value || [];
    
    if (event.checked) {
      examControl?.setValue([...currentExams, exam]);
    } else {
      examControl?.setValue(currentExams.filter((e: Exam) => e.id !== exam.id));
    }
    
    examControl?.markAsTouched();
  }

  onSubmit() {
    if (this.prueflingForm.valid) {
      const formData = this.prueflingForm.value;
      console.log('📝 Form submitted with data:', formData);
      this.dialogRef.close(formData);
    } else {
      console.log('❌ Form is invalid:', this.prueflingForm.errors);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
  
}
