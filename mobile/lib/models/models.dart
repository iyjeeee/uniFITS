// lib/models/models.dart — All data models for uniFITS.
// PROD: add fromJson() factory constructors and toJson() methods for API responses.

class AppUser {
  final String id;
  final String employeeNumber;
  final String firstName;
  final String lastName;
  final String fullName;
  final String gender;
  final String email;
  final String contactNumber;
  final String role;
  final String department;
  final String occupation;
  final String joined;
  final String status;
  final String? addressCity;
  final String? addressProvince;
  final String? photoUrl;

  const AppUser({
    required this.id, required this.employeeNumber,
    required this.firstName, required this.lastName, required this.fullName,
    required this.gender, required this.email, required this.contactNumber,
    required this.role, required this.department, required this.occupation,
    required this.joined, required this.status,
    this.addressCity, this.addressProvince, this.photoUrl,
  });

  // Partial update — returns copy with overridden fields
  AppUser copyWith({
    String? firstName, String? lastName, String? fullName,
    String? gender, String? email, String? contactNumber,
    String? role, String? department, String? occupation,
    String? addressCity, String? addressProvince,
  }) => AppUser(
    id: id, employeeNumber: employeeNumber, joined: joined, status: status,
    firstName: firstName ?? this.firstName,
    lastName: lastName ?? this.lastName,
    fullName: fullName ?? this.fullName,
    gender: gender ?? this.gender,
    email: email ?? this.email,
    contactNumber: contactNumber ?? this.contactNumber,
    role: role ?? this.role,
    department: department ?? this.department,
    occupation: occupation ?? this.occupation,
    addressCity: addressCity ?? this.addressCity,
    addressProvince: addressProvince ?? this.addressProvince,
    photoUrl: photoUrl,
  );
}

class Announcement {
  final String id;
  final String title;
  final String content;
  final bool isPinned;
  final String createdBy;
  final String createdAt;

  const Announcement({
    required this.id, required this.title, required this.content,
    required this.isPinned, required this.createdBy, required this.createdAt,
  });
}

class Project {
  final String id;
  final String title;
  final String projectType;
  final String description;
  final String startDate;
  final String endDate;
  final String location;
  final String status;
  final double targetFunding;
  final double currentFunding;

  const Project({
    required this.id, required this.title, required this.projectType,
    required this.description, required this.startDate, required this.endDate,
    required this.location, required this.status,
    required this.targetFunding, required this.currentFunding,
  });

  double get fundingPercent => targetFunding > 0
      ? (currentFunding / targetFunding * 100).clamp(0, 100) : 0;
}

class AppEvent {
  final String id;
  final String title;
  final String description;
  final String eventDate;
  final String eventTime;
  final String location;
  final String status;
  final double targetFunding;
  final double currentFunding;

  const AppEvent({
    required this.id, required this.title, required this.description,
    required this.eventDate, required this.eventTime, required this.location,
    required this.status, required this.targetFunding, required this.currentFunding,
  });

  double get fundingPercent => targetFunding > 0
      ? (currentFunding / targetFunding * 100).clamp(0, 100) : 0;
}

class Transaction {
  final String id;
  final String? userId;
  final String? userName;
  final String entryType;  // contribution | income | expense
  final String category;   // fund | project | event
  final String fund;
  final double amount;
  final String paymentMethod;
  final String referenceNumber;
  final String transactionDate;
  final String status;
  final String description;

  const Transaction({
    required this.id, this.userId, this.userName,
    required this.entryType, required this.category, required this.fund,
    required this.amount, required this.paymentMethod,
    required this.referenceNumber, required this.transactionDate,
    required this.status, required this.description,
  });
}

class Attendance {
  final String id;
  final String userId;
  final String userName;
  final String activityType; // event | project
  final String activity;
  final String attendanceDate;
  final String status; // present | absent | late | excused
  final String? remarks;
  final String recordedBy;

  const Attendance({
    required this.id, required this.userId, required this.userName,
    required this.activityType, required this.activity,
    required this.attendanceDate, required this.status,
    this.remarks, required this.recordedBy,
  });
}
