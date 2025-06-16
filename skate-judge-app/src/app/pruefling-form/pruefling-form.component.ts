import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    @Inject(MAT_DIALOG_DATA) public data: { eventId: string, exams: Exam[] }
  ) {
    this.prueflingForm = this.fb.group({
      name: ['', Validators.required],
      verein: ['', Validators.required],
      exam: [[], Validators.required]
    });
  }

  ngOnInit() {
    this.availableExams = this.data.exams;
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
      this.dialogRef.close(this.prueflingForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
