#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <ctype.h>
int sumOdd(int *arr, int n, int* found){
//@STUDENT:ADD YOUR CODE FOR FUNCTION HERE:
  int sum = 0;
  *found = 0;

  for (int i = 0; i < n; i++) {
    if (arr[i] % 2 != 0) {
      sum += arr[i];
      *found = 1;
    }
  }

// Fixed Do not edit anything here.
  return sum;
}
int main() {
  system("cls");
  //INPUT - @STUDENT:ADD YOUR CODE FOR INPUT HERE:
  int n = 0;
  scanf("%d", &n);

  int *arr = (int *)malloc(n * sizeof(int));
  for (int i = 0; i < n; i++) {
    scanf("%d", &arr[i]);
  }

  int found = 0;
  int sum = sumOdd(arr, n, &found);

  // Fixed Do not edit anything here.
  printf("\nOUTPUT:\n");
  //@STUDENT: WRITE YOUR OUTPUT HERE:
  if (found) {
    printf("%d", sum);
  } else {
    printf("There are no odd numbers in %d elements", n);
  }

  free(arr);

  //--FIXED PART - DO NOT EDIT ANY THINGS HERE
  printf("\n");
  system ("pause");
  return(0);
}
