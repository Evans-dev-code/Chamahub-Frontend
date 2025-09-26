import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ContributionService } from '../../services/contribution.service';
import { ChamaService, Chama } from '../../services/chama.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { ContributionDTO } from 'src/app/models/contribution.dto';

@Component({
  selector: 'app-contributions-admin',
  templateUrl: './contributions-admin.component.html',
  styleUrls: ['./contributions-admin.component.scss']
})
export class ContributionsAdminComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<ContributionDTO>([]);
  displayedColumns: string[] = ['memberName', 'cycle', 'amount', 'datePaid', 'status', 'penalty', 'actions'];

  chamas: Chama[] = [];
  selectedChamaId: number | null = null;
  availableCycles: string[] = [];
  selectedCycle: string = '';
  loading = false;

  totalContributions = 0;
  lateContributions = 0;
  onTimeContributions = 0;

  constructor(
    private contributionService: ContributionService,
    private chamaService: ChamaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.selectedChamaId = Number(localStorage.getItem('activeChamaId'));
    this.loadChamas();

    if (this.selectedChamaId) {
      this.loadContributions();
      this.loadCycles();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadChamas(): void {
    this.chamaService.getMyChamas().subscribe({
      next: (chamas) => this.chamas = chamas,
      error: (err) => this.snackBar.open('Failed to load chamas', 'Close', { duration: 3000 })
    });
  }

  loadContributions(): void {
    if (!this.selectedChamaId) return;
    this.loading = true;

    this.contributionService.getContributionsByChama(this.selectedChamaId, this.selectedCycle).subscribe({
      next: (contributions) => {
        this.dataSource.data = contributions;
        this.calculateStats(contributions);
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load contributions', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadCycles(): void {
    if (!this.selectedChamaId) return;

    this.contributionService.getAvailableCycles(this.selectedChamaId).subscribe({
      next: (cycles) => this.availableCycles = cycles,
      error: (err) => console.error('Error loading cycles:', err)
    });
  }

  onChamaChange(chamaId: number): void {
    this.selectedChamaId = chamaId;
    localStorage.setItem('activeChamaId', chamaId.toString());
    this.selectedCycle = '';
    this.loadContributions();
    this.loadCycles();
  }

  onCycleChange(cycle: string): void {
    this.selectedCycle = cycle;
    this.loadContributions();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  calculateStats(contributions: ContributionDTO[]): void {
    this.totalContributions = contributions.length;
    this.lateContributions = contributions.filter(c => c.status === 'LATE').length;
    this.onTimeContributions = contributions.filter(c => c.status === 'ON_TIME').length;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ON_TIME': return 'primary';
      case 'LATE': return 'warn';
      case 'PENDING': return 'accent';
      default: return '';
    }
  }

  exportToExcel(): void {
    const data = this.dataSource.data.map(c => ({
      'Member Name': c.memberName,
      'Cycle': c.cycle,
      'Amount (KES)': c.amount,
      'Date Paid': c.datePaid,
      'Status': c.status,
      'Penalty (KES)': c.penaltyAmount || 0,
      'Notes': c.notes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contributions');
    const fileName = `contributions_${this.selectedCycle || 'all'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    this.snackBar.open('Excel file downloaded successfully', 'Close', { duration: 3000 });
  }

  exportToCSV(): void {
    const data = this.dataSource.data.map(c => ({
      'Member Name': c.memberName,
      'Cycle': c.cycle,
      'Amount (KES)': c.amount,
      'Date Paid': c.datePaid,
      'Status': c.status,
      'Penalty (KES)': c.penaltyAmount || 0,
      'Notes': c.notes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `contributions_${this.selectedCycle || 'all'}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.snackBar.open('CSV file downloaded successfully', 'Close', { duration: 3000 });
  }

  refreshData(): void {
    this.loadContributions();
  }

  viewContributionDetails(contribution: ContributionDTO): void {
    this.snackBar.open(`Contribution: ${contribution.amount} KES by ${contribution.memberName}`, 'Close', { duration: 5000 });
  }
}
